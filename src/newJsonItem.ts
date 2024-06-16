class JsonItem {
  public key: string = '';
  public value: string = '';
  public raw: string = '';
  public comments: JsonComment[] = [];
}

type JsonComment = {
  inItemPosition: number;
  globalPosition: number;
  inRowPosition: number;
  comment: string;
};

export { JsonComment, JsonItem };
