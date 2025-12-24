/**
 * メッセージの型
 */
export interface Message {
  /** ID */
  id: string;
  /** 内容 */
  content: string;
  /** 送信者ID */
  senderId: string;
  /** 受信者ID */
  receiverId: string;
  /** 作成日時 */
  createdAt: string;
  /** 更新日時 */
  updatedAt: string;
}
