import { useHistory } from 'react-router-dom';
import { db } from '../../services/firebase';
import Modal from 'react-modal';

// import { useModal } from '../../hooks/useModal';
import deleteRoomIMG from '../../assets/images/delete-room.svg'


import "./style.scss";



type ModalRoomProps = {
  modalIsOpen: boolean;
  closeModal: () => void;
  roomId: string;
}

export const ModalRoom = ({ modalIsOpen , roomId, closeModal }: ModalRoomProps) => {
  const history = useHistory();

  const handleEndRoom = async () => {
    await db.ref(`/rooms/${roomId}`).update({
      endedAt: new Date(),
    });

    history.push("/");
  };

  return (
    <div>
      <Modal
        isOpen={modalIsOpen}
        contentLabel="Example Modal"
        className="modal-admin"
      >
        <img className="modal-admin__icon" src={deleteRoomIMG} alt="Icon Delete Room" />
        <h2 className="modal-admin__title">Encerrar sala</h2>
        <p className="modal-admin__description">
          Tem certeza que você deseja encerrar esta sala?
        </p>
        <div className="modal-admin__buttons">
         <button className="modal-admin__btn-cancel" onClick={closeModal}>Cancelar</button>
          <button className="modal-admin__btn-delete"  onClick={handleEndRoom}>Sim, encerrar</button>
        </div>
      </Modal>
    </div>
  );
};
