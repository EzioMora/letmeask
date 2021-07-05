import { useEffect, useState } from "react";
import { db } from "../services/firebase"
import { useAuth } from "./useAuth";

type FirebaseQuestions = Record<string, {
  author: {
    name: string,
    avatar: string
  },
  content: string,
  isHighLighted: boolean,
  isAnswered: boolean,
  likes: Record<string, {
    authorId: string,
  }>
}>

type QuestionsType = {
  id: string,
  author: {
    name: string,
    avatar: string
  },
  content: string,
  isHighLighted: boolean,
  isAnswered: boolean,
  likeCount: number,
  likeId: string | undefined,
}

export const useRoom = (roomId: string) => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<QuestionsType[]>([]);
  const [titleRoom, setTitleRoom] = useState('');

  useEffect(() => {
    const roomRef = db.ref(`/rooms/${roomId}`);

    roomRef.on('value', room => {
      const dbRoom = room.val();
      const firebaseQuestions: FirebaseQuestions = dbRoom.questions ?? {};
      
      const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
        return {
          id: key,
          author: value.author,
          content: value.content,
          isHighLighted: value.isHighLighted,
          isAnswered: value.isAnswered,
          likeCount: Object.values(value.likes ?? {}).length,
          likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0]
        }
      });

      setTitleRoom(dbRoom.title);
      setQuestions(parsedQuestions);
    })
    
    return () => {
      roomRef.off('value');
    }
  }, [roomId, user?.id])

  return { titleRoom, questions };
}