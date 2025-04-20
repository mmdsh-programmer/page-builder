import loadBlocks from "./blocks";

const swiper = ("swiperComponent", (editor, opts) => {
    let options = {
        label: "Swiper",
        name: "gjs-swiper",
        category: "Custom",
    };
    for(let name in options){
            if(!(name in opts)){
                opts[name] = options[name];
            }
    }
    loadBlocks(editor, opts);
});

export default swiper;