// définition des urls pour la récupération des informations
var urls = {
  classement: {
    d1: "http://www.fshbr.ch/competitions/index/1",
    d2: "http://www.fshbr.ch/competitions/index/2",
    d3a: "http://www.fshbr.ch/competitions/index/3",
    d3b: "http://www.fshbr.ch/competitions/index/4",
    juniors: "http://www.fshbr.ch/competitions/index/5",
    novices: "http://www.fshbr.ch/competitions/index/6",
    minis: "http://www.fshbr.ch/competitions/index/7"
  }
}

// met la page en 100% de haut
function setRealContentHeight() {
  var header = $.mobile.activePage.find("div[data-role='header']:visible");
  var footer = $.mobile.activePage.find("div[data-role='footer']:visible");
  var content = $.mobile.activePage.find("div.ui-content:visible:visible");
  var viewport_height = $(window).height();

  // var content_height = viewport_height - header.outerHeight() - footer.outerHeight();
  var content_height = viewport_height - (header.outerHeight() - 1) - (footer.outerHeight() - 1);
  if((content.outerHeight() - header.outerHeight() - footer.outerHeight()) <= viewport_height) {
    content_height -= (content.outerHeight() - content.height());
  }
  $(".ui-content").height(content_height);
}



// récupert le programme tv d'après un flux RSS donné
function classement(division, success){
  // récupert l'url du classement de la division demandée
  var url = urls.classement[division];

  // pour stocker les chaînes et leurs programmes
  var equipes = [];
  var equipe = '';

  $.get(url, function (data) {
    // parcourt les équipes
    $(data).find(".classement tbody tr").each(function(){
      var el = $(this);

      equipe = {};
      // récupert les informations de l'équipe en cours
      $scores = $(data).find("td");
      equipe.joue       = $scores[0];
      equipe.gagne      = $scores[1];
      equipe.egalite    = $scores[2];
      equipe.perdu      = $scores[3];
      equipe.marques    = $scores[4];
      equipe.encaisses  = $scores[5];
      equipe.difference = $scores[6];
      equipe.points     = $scores[7];
      console.log(equipe);
    });

    // appelle la fonction de callback avec en paramètre les chaînes trouvées    
    success(equipes);
  });
}



function init(){
  // met la page en 100% de haut
  $(document).on("pageshow", setRealContentHeight);

  // $(document).on("deviceready", function(){
  //   console.log('ready');
  // });

  // charge le menu
  $(document).on("pageshow", function(){
    $(".nav-menu").load("menu.html", function(){
      $(".nav-menu").panel();
      $(".nav-menu").trigger("updatelayout");
    });
  });
}