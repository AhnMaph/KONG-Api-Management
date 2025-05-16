export interface User{
    _id:string,
    name:string,
    email:string,
}
export interface isValidToken extends User {
    valid:boolean,
}
export interface CommentPayload {
    post_id: string;
    content: string;
    type: 'novel' | 'manga' | 'audio' | 'forum';
    parent?: string | null;
  }
  