export class Message {
  constructor(
    public _id: string,
    public viewed: string,
    public emitter: string,
    public receiver: string,
    public text: string
  ) {}
}
