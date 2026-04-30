export default function addDialogPlzWait() {
    const dialogPlzWait = document.createElement('dialog');
    dialogPlzWait.id = 'dialog-plz-wait';

    const aboutTitle = document.createElement('div');
    aboutTitle.id = 'dialog-title';
    aboutTitle.innerHTML = 'One moment please ...<i data-lucide="X" class="icon-close"></i>';
 
    dialogPlzWait.appendChild(aboutTitle);

    const divAnimation = document.createElement('div');
    divAnimation.classList.add('plz-wait');

    for(let i = 0; i < 5; i++) {
        divAnimation.appendChild(document.createElement('div')).classList.add('plz-wait-box')
    }
    
    dialogPlzWait.appendChild(divAnimation);

    return dialogPlzWait;
}
