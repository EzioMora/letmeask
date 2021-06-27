import copyIMG from '../assets/images/copy.svg'

import '../styles/roomCode.scss'

type RoomCodeProps = {
  code: string;
}

export const RoomCode = (props: RoomCodeProps) => {

  const copyRoomCodeToClipboard = () => {
    navigator.clipboard.writeText(props.code);
  }

  return (
    <button className="room-code" onClick={copyRoomCodeToClipboard}>
      <div>
        <img src={copyIMG} alt="copy room code" />
      </div>
      <span>Sala #{props.code}</span>
    </button>
  );
};