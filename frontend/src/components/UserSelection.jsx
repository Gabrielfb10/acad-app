import './UserSelection.css';

export default function UserSelection({ onSelectUser }) {
  return (
    <div className="user-selection-container">
      <div className="user-selection-content">
        <h1 className="user-selection-title">Quem está treinando hoje?</h1>
        <p className="user-selection-subtitle">Selecione o seu perfil para acessar os seus treinos</p>
        
        <div className="user-cards-grid">
          <button 
            className="user-card gabriel" 
            onClick={() => onSelectUser('Gabriel')}
          >
            <div className="user-avatar">
              <span className="user-initial">G</span>
            </div>
            <span className="user-name">Gabriel</span>
          </button>
          
          <button 
            className="user-card momo" 
            onClick={() => onSelectUser('Momô <3')}
          >
            <div className="user-avatar">
              <span className="user-initial">M</span>
              <span className="user-heart">❤️</span>
            </div>
            <span className="user-name">Momô &lt;3</span>
          </button>
        </div>
      </div>
    </div>
  );
}
