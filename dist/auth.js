(() => {
  const M=window.Miam;
  const destination=user=>`${user.role}.html${user.role==='etudiant'&&M.cartLines().length?'#panier':''}`;
  document.querySelectorAll('[data-password]').forEach(button=>button.addEventListener('click',()=>{const input=document.getElementById(button.dataset.password);input.type=input.type==='password'?'text':'password';button.textContent=input.type==='password'?'Afficher':'Masquer';button.setAttribute('aria-label',`${button.textContent} le mot de passe`);}));
  async function submit(form,handler){form.addEventListener('submit',async event=>{event.preventDefault();const button=form.querySelector('[type=submit]'),error=form.querySelector('.form-error');error.textContent='';button.disabled=true;button.setAttribute('aria-busy','true');try{const user=await handler(Object.fromEntries(new FormData(form)));form.dataset.saving="true";location.href=destination(user);}catch(e){error.textContent=e.message;error.scrollIntoView({block:'nearest'});}finally{button.disabled=false;button.removeAttribute('aria-busy');}});}
  const googleDialog=document.querySelector('#google-dialog');
  document.querySelector('[data-google]')?.addEventListener('click',()=>{googleDialog.querySelector('.form-error').textContent='';googleDialog.showModal();});
  document.querySelectorAll('[data-google-close]').forEach(button=>button.addEventListener('click',()=>googleDialog.close()));
  const login=document.querySelector('#login-form');if(login)submit(login,form=>M.login(form.email,form.password));
  const register=document.querySelector('#register-form');if(register){submit(register,form=>M.register(form));const code=new URLSearchParams(location.search).get('parrain');if(code)register.elements.referral.value=code.slice(0,20);}
  document.querySelector('#forgot-form')?.addEventListener('submit',event=>{event.preventDefault();event.currentTarget.querySelector('.form-result').textContent='La réinitialisation du mot de passe par e-mail n’est pas encore disponible. Aucun e-mail n’a été envoyé.';});
})();
