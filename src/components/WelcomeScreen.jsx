import backgroundWelcomeImage from '../assets/welcome_background.png';
import { useNavigate } from 'react-router-dom';

const WelcomeScreen = () => {
  const navigate = useNavigate();

    return (
     <div
      className="relative flex size-full min-h-screen flex-col bg-white justify-between group/design-root overflow-x-hidden"
      style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}
    >
      <div>
        <div className="@container">
          <div className="@[480px]:px-4 @[480px]:py-3">
            <div
              className="w-full bg-center bg-no-repeat bg-cover flex flex-col justify-end overflow-hidden bg-white @[480px]:rounded-xl min-h-80"
              style={{ backgroundImage: `url(${backgroundWelcomeImage})` }}
            ></div>
          </div>
        </div>
        <h2 className="text-[#111318] tracking-light text-[28px] font-bold leading-tight px-4 text-center pb-3 pt-5">Mais que colegas, unifriends</h2>
        <p className="text-[#111318] text-base font-normal leading-normal pb-3 pt-1 px-4 text-center">
          Encontre pessoas universitárias com objetivos e interesses parecidos e construa amizades que fazem sentido
        </p>
        <div className="flex justify-center">
          <div className="flex flex-1 gap-3 max-w-[480px] flex-col items-stretch px-4 py-3">
            <button
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-5 bg-[#135bec] text-white text-base font-bold leading-normal tracking-[0.015em] w-full"
              onClick={() => {navigate('/signup/email')}}
            >
              <span className="truncate">Registrar</span>
            </button>
            <button
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-5 bg-[#f0f2f4] text-[#111318] text-base font-bold leading-normal tracking-[0.015em] w-full"
              onClick={() => {navigate('/login')}}
            >
              <span className="truncate">Entrar</span>
            </button>
          </div>
        </div>
      </div>
      <div>
        <p className="text-[#616f89] text-sm font-normal leading-normal pb-3 pt-1 px-4 text-center">Ao continuar, você concorda com nossos Termos de Serviço e Política de Privacidade</p>
        <div className="h-5 bg-white"></div>
      </div>
    </div>
);
};

export default WelcomeScreen;