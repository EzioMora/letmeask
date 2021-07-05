import { ReactNode } from "react";
import "./style.scss";

type QuestionsProps = {
  content: string,
  author: {
    name: string,
    avatar: string
  }
  children?: ReactNode
}

export const Questions = ({content, author, children}: QuestionsProps) => {
  return (
    <div className="question">
      <p>{content}</p>
      <footer>
        <div className="user-info">
          <img src={author.avatar} alt={author.name} />
          <span>{author.name}</span>
        </div>
        <div>
          {children}
        </div>
      </footer>
    </div>
  );
};