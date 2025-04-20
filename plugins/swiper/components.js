import { getProps } from "./update";
import { traits } from "./traits";

const loadComponents = (editor, opts = {}) => {
  const dc = editor.DomComponents;
  const defaultType = dc.getType("default");
  const defaultView = defaultType.view;
  const scriptProps = [
    "id",
    "pagination",
    "navigation",
    "progressType",
    "slidesCount",
    "paginationColor",
    "dynamicBullets",
  ];

  dc.addType(opts.name, {
    model: {
      defaults: {
        traits,
        script: (props) => {
            const initLib = () => {
              // Check if a Swiper instance already exists and destroy it
              if (window[`${props.id}`]) {
                window[`${props.id}`].destroy(true, true);
              }

              const options = {
                spaceBetween: 30,
                centeredSlides: true,
                autoplay: {
                  delay: 2500,
                  disableOnInteraction: false,
                },
              };

              if (props.pagination) {
                options.pagination = {
                  el: `.swiper-pagination`,
                  clickable: true,
                };
                if (props.progressType) {
                  options.pagination.type = props.progressType;
                }
                options.pagination.dynamicBullets = !!props.dynamicBullets;  
              }
              if (props.navigation) {
                options.navigation = {
                  nextEl: `.swiper-button-next`,
                  prevEl: `.swiper-button-prev`,
                };
              }
              window[`${props.id}`] = new Swiper(`.${props.id}`, options);
            };
            if (typeof Swiper === "undefined") {
              const script = document.createElement("script");
              script.onload = initLib;
              script.src = "http://localhost:3000/swiper-bundle.min.js";
              document.body.appendChild(script);
            } else {
              initLib();
            }
        },
        id: opts.id,
        pagination: true,
        navigation: true,
        progressType: "bullets",
        slidesCount: 3,
        paginationColor: "#096dd9",
        dynamicBullets: false,
        "script-props": scriptProps,
      },
    },
    isComponent: (el) => {
      if (el.className && el.className === "swiper") {
        console.log(el.className);
        return {
          type: opts.name,
        };
      }
    },
    view: defaultView.extend({
      init({ model }) {
        const handleUpdateScript = () => {
          const props = getProps(model, scriptProps);
          opts.updateScript(editor, model.get("id"), props);
        }
        this.listenTo(model, "change:navigation", handleUpdateScript);
        this.listenTo(model, "change:slidesCount", handleUpdateScript);
        this.listenTo(model, "change:paginationColor", handleUpdateScript);
        this.listenTo(model, "change:dynamicBullets", handleUpdateScript);
      },
    }),
  });
};

export default loadComponents;
