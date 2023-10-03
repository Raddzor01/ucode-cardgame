var $container = $("#player1-area"),
  gridWidth = 150,
  gridHeight = 250,
  gridRows = 1,
  gridColumns = 7,
  i, x;

let containerWidth = $container.width(),
  totalDivsWidth = gridColumns * gridWidth,
  leftOffset = (containerWidth - totalDivsWidth) / 2;

for (i = 0; i < gridColumns; i++) {
  x = i * gridWidth + leftOffset; // добавляем смещение
  $("<div/>").css({
    position: "absolute",
    background: "red",
    border: "1px solid #454545",
    width: gridWidth - 1,
    height: gridHeight - 1,
    top: 5,
    left: x,
    zIndex: -9999
  }).prependTo($container).addClass("dropzone");
}
let startPosition = {};
$(".card").draggable({
  containment: "parent",
  revert : "invalid",
  start: function(event, ui) {
      console.log("Drag started");
      startPosition = $(this).position();
      ui.helper.css( {
        "transition": "none",
      } );
  },
  stop: function(event, ui) {
      console.log("Drag stopped");
      ui.helper.css( {
        "transition": "all 0.3s ease-in-out",
      } );
  }
});

$(".dropzone").droppable({
  accept: ".card",
  drop: function(event, ui) {
    ui.draggable.data('dropped', true);
      console.log("Card was dropped into a dropzone");
      
      ui.draggable.draggable("disable");  // отключаем возможность перетаскивания
      ui.draggable.css({
          "cursor": "default",  // меняем курсор
          "left": "",         // сбрасываем стиль left
          "top": "",          // сбрасываем стиль top
          "position": "relative", // сбрасываем стиль position
          "transform": "none"           // сбрасываем стиль top
      });
      
      $(this).append(ui.draggable);  // перемещаем элемент в дропзону
  }
});

