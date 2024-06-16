import { JsonComment, JsonItem } from './newJsonItem';

// settings.json用のParser
class jsonParser {
  private comments: JsonComment[] = [];
  private jsonString: string = '';
  private jsonStringWithoutComment: string = '';
  private json: JsonItem[] = [];

  constructor(jsonString: string) {
    this.jsonString = jsonString;
    this.comments = this.parseComment(jsonString);
    this.jsonStringWithoutComment = this.trimComments();
    this.json = this.parseJson();
  }

  private parseComment(json: string): JsonComment[] {
    const lines = json.split('\n');
    let inItem = false;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      let comment: JsonComment = { inItemPosition: 0, globalPosition: i, inRowPosition: 0, comment: '' };
      for (let j = 0; j < line.length - 1; j++) {
        const substr = line.slice(j, j + 2);

        if (!inItem && substr === '/*') {
          inItem = true;
          comment.inRowPosition = j;
          comment.comment += substr;
          j += 1;
          continue;
        } else if (inItem && substr === '*/') {
          inItem = false;
          comment.comment += substr;
          this.comments.push(comment);
          comment = { inItemPosition: 0, globalPosition: i, inRowPosition: 0, comment: '' };
          j += 1;
          continue;
        } else if (!inItem && substr === '//') {
          comment.inRowPosition = j;
          comment.comment += line.slice(j);
          this.comments.push(comment);
          break;
        }

        if (inItem) {
          comment.comment += line[j];
          if (j === line.length - 2) {
            comment.comment += line[j + 1];
          }
        }
      }
      if (inItem) {
        this.comments.push(comment);
      }
    }
    return this.comments;
  }

  private parseJson(): JsonItem[] {
    const jsonStr = this.jsonStringWithoutComment;
    const lines = jsonStr.split('\n');

    const comments = this.getComments();
    const commentsIter = comments[Symbol.iterator]();
    let comment = commentsIter.next();

    let inJson = false;
    let completed = false;
    let inJsonSpreaded = false;
    let jsonItem = new JsonItem();
    let keyFlag = false;
    let keyEndFlag = false;
    let valueFlag = false;
    let braceLevel = 0;
    let bracketLevel = 0;
    let itemRowCount = 0;
    let finished = false;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      for (let j = 0; j < line.length; j++) {
        const char = line[j];
        if (!inJson && char === '{') {
          inJson = true;
          break;
        }
        if (inJson) {
          if (char === ' ') {
            continue;
          }
          if (!keyFlag) {
            if (char === '"') {
              keyFlag = true;
              continue;
            }
          }
          if (!keyEndFlag && !valueFlag) {
            if (char === '"') {
              keyEndFlag = true;
              continue;
            }
            jsonItem.key += char;
            continue;
          }
          if (!valueFlag) {
            if (char === ':') {
              valueFlag = true;
              continue;
            }
          }
          if (valueFlag) {
            if (char === '{') {
              braceLevel++;
            }
            if (char === '}') {
              braceLevel--;
              if (braceLevel === -1) {
                completed = true;
                break;
              }
            }
            if (char === '[') {
              bracketLevel++;
            }
            if (char === ']') {
              bracketLevel--;
            }
            if (char === ',' && braceLevel === 0 && bracketLevel === 0) {
              finished = true;
              break;
            }
            jsonItem.value += char;
          }
        }
      }

      if (!inJsonSpreaded) {
        if (inJson) {
          inJsonSpreaded = true;
          continue;
        }
        continue;
      }

      if (completed) {
        this.json.push(jsonItem);
        break;
      }

      jsonItem.raw += line + '\n';
      itemRowCount++;
      while (!comment.done && i === comment.value.globalPosition) {
        comment.value.inItemPosition = itemRowCount - 1;
        jsonItem.comments.push(comment.value);
        comment = commentsIter.next();
      }

      if (finished) {
        this.json.push(jsonItem);
        jsonItem = new JsonItem();
        keyFlag = false;
        keyEndFlag = false;
        valueFlag = false;
        itemRowCount = 0;
        finished = false;
      }
    }
    return this.json;
  }

  private trimComments(): string {
    const comments = this.getComments();
    const commentsIter = comments[Symbol.iterator]();
    let comment = commentsIter.next();
    let result = '';

    const lines = this.jsonString.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (comment.done) {
        result += lines[i] + '\n';
        continue;
      }
      if (i !== comment.value.globalPosition) {
        result += lines[i] + '\n';
        continue;
      }

      let line = lines[i];
      while (!comment.done && i === comment.value.globalPosition) {
        line = line.replace(comment.value.comment, '');
        comment = commentsIter.next();
      }
      result += line + '\n';
    }

    return result;
  }

  public getComments(): JsonComment[] {
    return this.comments;
  }

  public getJson(): JsonItem[] {
    return this.json;
  }
}

export default jsonParser;
