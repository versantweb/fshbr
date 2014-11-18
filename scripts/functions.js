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


// pour stocker la division que l'on regarde 
var division = '';

// pour stocker l'équipe' que l'on regarde 
var equipe = '';



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

  // modifie le titre de la page
  $('#page_classement h1').append(" " + division);

  // récupert le classement de la division demandée
  $.get(url, function(data){
    var x = 0;
    
    var $liste = $("#page_classement .classement tbody");

    // vide le classement
    $liste.empty();

    // parcourt les équipes
    var $equipes = $(data).find(".classement tbody tr");

    $equipes.each(function(){
      var $el = $(this);
      equipe = {};
      // récupert les informations de l'équipe en cours
      $scores = $el.find("td");
      equipe.nom        = $($scores[0]).text();
      equipe.joue       = $($scores[1]).text();
      equipe.gagne      = $($scores[2]).text();
      equipe.egalite    = $($scores[3]).text();
      equipe.perdu      = $($scores[4]).text();
      equipe.marques    = $($scores[5]).text();
      equipe.encaisses  = $($scores[6]).text();
      equipe.difference = $($scores[7]).text();
      equipe.points     = $($scores[8]).text();
      // log(JSON.stringify(equipe));
      $liste.append("<tr class='equipe'><td>" + equipe.nom + "</td><td>" + equipe.joue + "</td><td>" + equipe.gagne + "</td><td>" + equipe.egalite + "</td><td>" + equipe.perdu + "</td><td>" + equipe.marques + "</td><td>" + equipe.encaisses + "</td><td>" + equipe.difference + "</td><td>" + equipe.points + "</td></tr>")
    });

    // appelle la fonction de callback avec en paramètre les chaînes trouvées    
    success(equipes);
  });
}

function test(){
  var $cont = $('<table><tr><td><img src="http://www.fshbr.ch/img/clubs/murist-montet-black-tigers-hover.png"><a href="http://www.fshbr.ch/equipes/equipe/50">Murist/Montet Black Tigers II</a></td><td>2</td><td>1</td><td>0</td><td>1</td><td>12</td><td>13</td><td>-1</td><td>2</td></tr><tr><td><img src="http://www.fshbr.ch/img/clubs/murist-montet-black-tigers-hover.png"><a href="http://www.fshbr.ch/equipes/equipe/50">Murist/Montet Black Tigers II</a></td><td>2</td><td>1</td><td>0</td><td>1</td><td>12</td><td>13</td><td>-1</td><td>2</td></tr></table>');
  var $liste = $("#page_classement .classement tbody");

  $liste.empty();

  var $equipes = $cont.find("tr");

  console.log($equipes);

  $equipes.each(function(){
    var $el = $(this);
    equipe = {};
    $scores = $el.find("td");
    equipe.nom        = $($scores[0]).text();
    equipe.joue       = $($scores[1]).text();
    equipe.gagne      = $($scores[2]).text();
    equipe.egalite    = $($scores[3]).text();
    equipe.perdu      = $($scores[4]).text();
    equipe.marques    = $($scores[5]).text();
    equipe.encaisses  = $($scores[6]).text();
    equipe.difference = $($scores[7]).text();
    equipe.points     = $($scores[8]).text();
    
    $liste.append("<tr class='equipe'><td>" + equipe.nom + "</td><td>" + equipe.joue + "</td><td>" + equipe.gagne + "</td><td>" + equipe.egalite + "</td><td>" + equipe.perdu + "</td><td>" + equipe.marques + "</td><td>" + equipe.encaisses + "</td><td>" + equipe.difference + "</td><td>" + equipe.points + "</td></tr>")
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

  // lors d'un clic sur une division (pour voir le classement)
  $(document).on("click", ".division", function(){
    classement($(this).data('division'), function(){
      document.location = "#page_classement";
      // raffraichit la liste
      $("#page_classement .classement").table("rebuild");;
    });
    

    // test();
    // document.location = "#page_classement";
    // // raffraichit la liste
    // $("#page_classement .classement").table( "rebuild" );;
  });
}



function log(text){
  $('.console').append("<div>" + text + "</div>");
}