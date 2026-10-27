/* Shared field validation, search reset, and bounded table navigation. */
(() => {
  let sequence=0,dirty=new WeakSet(),leaving=false;
  const hasDraft=()=>[...document.forms].some(f=>dirty.has(f)&&!f.classList.contains('search-form')&&f.dataset.saving!=='true');
  document.addEventListener('input',e=>{if(e.target.form)dirty.add(e.target.form);});
  window.addEventListener('miam:change',()=>{dirty=new WeakSet();});
  window.addEventListener('beforeunload',e=>{if(!leaving&&hasDraft()){e.preventDefault();e.returnValue='';}});
  document.addEventListener('click',e=>{const link=e.target.closest('a[href]');if(!link||!hasDraft()||leaving||link.href===location.href)return;e.preventDefault();e.stopImmediatePropagation();const d=document.createElement('dialog');d.className='workspace-dialog';d.setAttribute('aria-labelledby','draft-title');d.innerHTML='<h2 id="draft-title">Quitter sans enregistrer ?</h2><p class="modal-description">Les modifications de ce formulaire ne seront pas conservées.</p><div class="modal-actions"><button class="secondary-btn" data-draft="stay" autofocus>Rester sur le formulaire</button><button class="danger-btn" data-draft="leave">Quitter sans enregistrer</button></div>';document.body.append(d);d.addEventListener('close',()=>{d.remove();link.focus();});d.querySelector('[data-draft=stay]').onclick=()=>d.close();d.querySelector('[data-draft=leave]').onclick=()=>{leaving=true;dirty=new WeakSet();d.close();location.href=link.href;setTimeout(()=>leaving=false,100);};d.showModal();},true);
  function enhance(scope=document){
    scope.querySelectorAll('form').forEach(form=>{form.noValidate=true;});
    scope.querySelectorAll('textarea').forEach(input=>{input.style.resize='none';});
    scope.querySelectorAll('input[type=password]').forEach(input=>{if(input.closest('.password-field'))return;const wrap=document.createElement('span');wrap.className='password-field';input.before(wrap);wrap.append(input);const button=document.createElement('button');button.type='button';button.textContent='Afficher';button.setAttribute('aria-label','Afficher le mot de passe');wrap.append(button);button.onclick=()=>{input.type=input.type==='password'?'text':'password';button.textContent=input.type==='password'?'Afficher':'Masquer';button.setAttribute('aria-label',`${button.textContent} le mot de passe`);};});
    scope.querySelectorAll('.search-form input').forEach(input=>{
      if(input.parentElement.querySelector('[data-clear-search]'))return;
      const button=document.createElement('button');button.type='button';button.dataset.clearSearch='';button.textContent='×';button.setAttribute('aria-label','Effacer la recherche');button.hidden=!input.value;input.after(button);
    });
    scope.querySelectorAll('.table-wrap').forEach(wrap=>{
      if(wrap.dataset.paged)return;wrap.dataset.paged='true';const rows=[...wrap.querySelectorAll('tbody tr')];if(rows.length<=12)return;
      let page=0;const pages=Math.ceil(rows.length/12),nav=document.createElement('div');nav.className='table-pagination';nav.setAttribute('aria-label','Pagination du tableau');wrap.after(nav);
      const draw=()=>{rows.forEach((row,i)=>row.hidden=i<page*12||i>=(page+1)*12);nav.innerHTML=`<span>${page*12+1}–${Math.min((page+1)*12,rows.length)} sur ${rows.length}</span><button type="button" data-page="prev" ${page===0?'disabled':''}>← Précédent</button><button type="button" data-page="next" ${page===pages-1?'disabled':''}>Suivant →</button>`;};
      nav.addEventListener('click',e=>{const b=e.target.closest('[data-page]');if(!b)return;page+=b.dataset.page==='next'?1:-1;draw();wrap.scrollTop=0;nav.querySelector(`[data-page="${b.dataset.page}"]`)?.focus();});draw();
    });
  }
  function message(input){const v=input.validity;if(v.valueMissing)return input.type==='checkbox'?'Cochez cette case pour continuer.':'Complétez ce champ.';if(v.typeMismatch)return 'Saisissez une adresse e-mail valide.';if(v.tooShort)return `Utilisez au moins ${input.minLength} caractères.`;if(v.rangeUnderflow)return `La valeur minimale est ${input.min}.`;if(v.rangeOverflow)return `La valeur maximale est ${input.max}.`;if(v.patternMismatch)return 'Vérifiez le format de ce champ.';if(v.stepMismatch)return 'Saisissez une valeur entière.';return 'Vérifiez la valeur de ce champ.';}
  document.addEventListener('submit',event=>{
    const form=event.target;if(!(form instanceof HTMLFormElement))return;
    form.querySelectorAll('[aria-invalid]').forEach(input=>{input.removeAttribute('aria-invalid');input.removeAttribute('aria-describedby');});form.querySelectorAll('.input-error').forEach(x=>x.remove());
    const invalid=[...form.elements].filter(input=>input.willValidate&&!input.validity.valid);if(!invalid.length)return;
    event.preventDefault();event.stopImmediatePropagation();
    invalid.forEach(input=>{const error=document.createElement('span');error.className='input-error';error.id=`input-error-${++sequence}`;error.textContent=message(input);input.setAttribute('aria-invalid','true');input.setAttribute('aria-describedby',error.id);(input.closest('.field,.check-row,.quiz-option')||input.parentElement).append(error);});invalid[0].focus();
  },true);
  document.addEventListener('input',event=>{const input=event.target;if(input.matches('.search-form input'))input.parentElement.querySelector('[data-clear-search]').hidden=!input.value;});
  document.addEventListener('click',event=>{const b=event.target.closest('[data-clear-search]');if(!b)return;const form=b.closest('form'),input=form.querySelector('input');input.value='';b.hidden=true;form.requestSubmit();document.querySelector('.search-form input')?.focus();});
  enhance();new MutationObserver(records=>{if(records.some(r=>[...r.addedNodes].some(n=>n.nodeType===1)))enhance();}).observe(document.body,{childList:true,subtree:true});
})();
