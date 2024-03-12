//Variabile per immagazzinare data
let data;

//Chiamata API
async function getWord() {
  //INSERIRE PUNTATORE PER FAR COMPARIRE PAROLA

  try {
    //response
    const response = await fetch(
      'https://random-word-api.herokuapp.com/word?number=50&lang=it'
    );

    if (!response.ok) {
      throw new Error('Parola non trovata');
    }

    // trasformo in json
    data = await response.json();
    console.log(data);

    setupGame();
  } catch (error) {
    console.log('errore:', error.message);
  }
}
getWord();

function setupGame() {
  //Variabili
  let contaErrori = 0;
  let lettereIndovinate = [];
  let vite = 7;

  let parolaCasuale = data[Math.floor(Math.random() * data.length)];
  let arrayParolaCasuale = parolaCasuale.split('');

  // Parola verificata in console
  console.log(parolaCasuale);

  //Puntatori
  const parolaContainer = document.getElementById('parola-container');
  const rigiocaBtn = document.getElementById('btn');
  const risultatoContainer = document.getElementById('risultato-container');
  const input = document.getElementById('input');

  //Listener che chiama hangman per l'imput
  input.addEventListener('input', hangman);

  //Creazione dei trattini in base alla lunghezza della parola
  for (let i = 0; i < parolaCasuale.length; i++) {
    const trattino = document.createElement('h1');
    trattino.textContent = '_';
    trattino.classList.add('mx-[6px]');
    parolaContainer.appendChild(trattino);
  }

  //Funzione hangman per dinamiche del gioco
  function hangman() {
    //controlla se l'input non è vuoto
    if (input.value.trim() === '') {
      return; // Esci dalla funzione se l'input è vuoto
    }
    let ultimaLettera = input.value[input.value.length - 1];
    // console.log(ultimaLettera);

    //Condizione per quando si indovina la lettera
    if (parolaCasuale.includes(ultimaLettera)) {
      if (!lettereIndovinate.includes(ultimaLettera)) {
        lettereIndovinate.push(ultimaLettera);
      }
      // Aggiorna la visualizzazione delle lettere indovinate
      for (let i = 0; i < parolaCasuale.length; i++) {
        if (lettereIndovinate.includes(parolaCasuale[i])) {
          parolaContainer.children[i].textContent = parolaCasuale[i];
        }
      }
      //altra condizione: lettera non indovinata(incremento del conta errori) + gestione vite + gestione amico svg
    } else {
      contaErrori++;
      rimuoviCuore();
      impiccatoSvg();
      if (contaErrori === 7) {
        //Visualizzazione a schermo di HAI PERSO
        const esito = document.createElement('h2');
        const haiPersoSpan = document.createElement('span');
        haiPersoSpan.textContent = 'Hai perso ';
        haiPersoSpan.classList.add('text-[#b30436]', 'font-bold');
        esito.appendChild(haiPersoSpan);

        // Aggiunta dell'elemento ad h2
        const parolaSpan = document.createElement('span');
        parolaSpan.textContent = 'la parola era: ';
        parolaSpan.classList.add('text-[#777]');
        esito.appendChild(parolaSpan);

        //text node per aggiungere la parola casuale
        esito.appendChild(document.createTextNode(parolaCasuale));
        esito.classList.add('py-[8px]', 'text-[#777]', 'font-bold');
        risultatoContainer.appendChild(esito);

        //Nascondere l'input quando hai perso
        input.classList.add('hidden');

        //Funzione per rigiocare
        rigioca();
      }
    }

    // Funzione per verificare la vittoria (lettere in array attuale === array della parola casuale)
    function verificaLettereInArray(lettereIndovinate, arrayParolaCasuale) {
      for (let i = 0; i < arrayParolaCasuale.length; i++) {
        const letteraCorrente = arrayParolaCasuale[i];
        if (!lettereIndovinate.includes(letteraCorrente)) {
          return false; // Se una lettera manca, restituisci falso
        }
      }
      return true; // Se tutte le lettere sono presenti, restituisci vero
    }

    //Funzione applicata ad array per verificare nel gioco
    const tutteLeLetterePresenti = verificaLettereInArray(
      lettereIndovinate,
      arrayParolaCasuale
    );

    //condizione per creare elemento testuale quando si vince
    if (tutteLeLetterePresenti) {
      const esito = document.createElement('h2');
      esito.textContent = 'Top, hai vinto!';
      esito.classList.add('text-green-400', 'font-bold', 'py-[8px]');
      risultatoContainer.appendChild(esito);

      //funzione x rigiocare
      rigioca();

      //nascondere input
      input.classList.add('hidden');

      //rimuovere il container delle vite quando appare hai vinto
      const viteContainer = document.getElementById('vite-container');
      viteContainer.style.display = 'none';
    }

    //Funzione x rigiocare
    function rigioca() {
      const btn = document.createElement('button');
      btn.textContent = 'Rigioca';
      btn.classList.add(
        'border-2',
        'border-[#bb86fc]',
        'ml-[20px]',
        'px-[20px]',
        'py-[8px]',
        'rounded-md',
        'text-[#bb86fc]'
      );
      rigiocaBtn.appendChild(btn);
      btn.addEventListener('click', function () {
        //caricamento dlla pagina quando si preme il bottone
        location.reload();
      });
    }
  }

//Funzione x far comparire impiccato
function impiccatoSvg() {
  
  switch (contaErrori) {
    case 1: 
      document.getElementById('gamba-sinistra').style.display = 'block';
      break;
    case 2:
      document.getElementById('gamba-destra').style.display = 'block';
      break;
    case 3:
      document.getElementById('corpo').style.display = 'block';
      break;
    case 4:
      document.getElementById('braccio-destro').style.display = 'block';
      break;
    case 5:
      document.getElementById('braccio-sinistro').style.display = 'block';
      break;
    case 6:
      document.getElementById('testa').style.display = 'block';
      break;
    case 7:
      document.getElementById('x').style.display = 'block';
      break;

  }
  // Supponiamo che "contaErrori" rappresenti il numero di errori dell'utente
  // if (contaErrori === 1) {
  //   document.getElementById('gamba-sinistra').style.display = 'block';
  // } else if (contaErrori === 2) {
  //   document.getElementById('gamba-destra').style.display = 'block';
  // } else if (contaErrori === 3) {
  //   document.getElementById('corpo').style.display = 'block';
  // } else if (contaErrori === 4) {
  //   document.getElementById('braccio-destro').style.display = 'block';
  // } else if (contaErrori === 5) {
  //   document.getElementById('braccio-sinistro').style.display = 'block';
  // } else if (contaErrori === 6) {
  //   document.getElementById('testa').style.display = 'block';
  // } else if (contaErrori === 7) {
  //   document.getElementById('x').style.display = 'block';
  // }
}

  //Funzione rimuovi cuori
  function rimuoviCuore() {
    vite--;
    const viteContainer = document.getElementById('vite-container');
    viteContainer.innerHTML = '';

    // Aggiungi il testo "Vite:"
    const testoVite = document.createElement('p');
    testoVite.textContent = 'Vite: ';
    viteContainer.appendChild(testoVite);

    for (let i = 0; i < vite; i++) {
      const cuore = document.createElement('i');
      cuore.classList.add(
        'fa',
        'fa-heart',
        'text-[#bb86fc]',
        'text-[20px]',
        'py-[5px]',
        'mx-[5px]'
      );
      document.getElementById('vite-container').appendChild(cuore);
    }
    if (vite === 0) {
      const viteContainer = document.getElementById('vite-container');
      viteContainer.style.display = 'none';
    }
  }
}
