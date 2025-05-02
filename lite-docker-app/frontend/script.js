function updateAspectRatio() {
    const ratio = window.innerWidth / window.innerHeight;
    document.documentElement.style.setProperty(
      '--aspect-ratio',
      ratio.toFixed(4)
    );
  }
  
  window.addEventListener('resize', updateAspectRatio);
  window.addEventListener('DOMContentLoaded', updateAspectRatio);
  

const quotes = [
    'Сегодня — идеальный день, чтобы начать что-то новое.',
    'Не бойтесь делать ошибки. Бойтесь ничего не делать.',
    'Большие перемены начинаются с маленьких шагов.',
    'Ваш потенциал безграничен.',
    'Каждое усилие приближает вас к цели.',
    'Успех — это сумма небольших усилий, повторяющихся изо дня в день.',
    'Сложности — это ступеньки к росту.',
    'Вы сильнее, чем думаете.',
    'Если не вы, то кто? Если не сейчас, то когда?',
    'Упорство побеждает талант, если талант не упорствует.',
  ];
  
  document.getElementById('generate').addEventListener('click', () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    document.getElementById('quote').textContent = quotes[randomIndex];
  });
  