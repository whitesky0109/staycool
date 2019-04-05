/* eslint-disable import/prefer-default-export */

export const setTitle = (user, title, img, desc) => {
  const rootElem = document.getElementById('statsMainDiv');
  const k = (user.kill / user.play).toFixed(1);
  const d = (user.death / user.play).toFixed(1);
  const a = (user.asist / user.play).toFixed(1);

  rootElem.insertAdjacentHTML('beforeend', `
    <div class="row stats-title-div border border-info" >
        <div class="col-sm-4">
            <img src="${img}" />
        </div> 
        <div class="col-sm-4">
            <H4>
                <span class="badge badge-primary">${title}
            </H4>
            <p>${user.userId}</p>
            <p>KDA: ${k}/${d}/ ${a}</p>
            <p>Play: ${user.play}</p>
        </div>
        <div class="col-sm-4">
            <p>${desc}</p>
        </div>
    </div>
  `.trim());
};
