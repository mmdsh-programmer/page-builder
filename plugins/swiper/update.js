export const getProps = (model,propNames) => {
    const props = {};
    for(const propName of propNames){
        props[propName] = model.get(propName);
    }
    return props;
}
export const updateScript = (editor, uniqueId, props) => {
    const block = editor.getWrapper().find(`.${uniqueId}`)[0];
    if (block) {
       const slidesArrayContent = Array.from({ length: +props.slidesCount }, (_, index) => {
        return `<div class="swiper-slide" key=${index}>Slide ${index + 1}</div>`;
       }).join("").replace(/,/g, "");

       const style = `
            .${uniqueId} .swiper-pagination-bullet{
                width: 10px;
                height: 10px;
                background: red;
            }
            .${uniqueId} .swiper-pagination-bullet-active{
                width: 15px;
                height: 15px;
                background: ${props.paginationColor};
            }
       `;
       block.components(`
                <div class="swiper-wrapper">
                    ${slidesArrayContent}
                </div>
                <div class="swiper-pagination"></div>
                ${props.navigation ? `
                    <div class="swiper-button-prev"></div>
                    <div class="swiper-button-next"></div>  
                ` : ""}
                <div class="swiper-scrollbar"></div>
                <style>${style}</style>
      `);
    }
}