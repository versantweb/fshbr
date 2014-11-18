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
function get_classement(division, success){
  // récupert l'url du classement de la division demandée
  var url = urls.classement[division];

  // pour stocker les chaînes et leurs programmes
  var equipes = [];
  var equipe = '';

  // modifie le titre de la page
  $('#page_classement h1').html("Classement " + division);

  var $liste = $("#page_classement .classement tbody");

  // vide le classement
  $liste.empty();

  // récupert le classement de la division demandée
  $.get(url, function(data){
    var x = 0;
    
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
      equipe.link       = $($scores[0]).find("a").attr("href");
      // log(JSON.stringify(equipe));
      $liste.append("<tr class='equipe'><td><a href='#' class='equipe_link' data-url='" + equipe.link + "' data-nom='" + equipe.nom + "'>" + equipe.nom + "</a></td><td>" + equipe.joue + "</td><td>" + equipe.gagne + "</td><td>" + equipe.egalite + "</td><td>" + equipe.perdu + "</td><td>" + equipe.marques + "</td><td>" + equipe.encaisses + "</td><td>" + equipe.difference + "</td><td>" + equipe.points + "</td></tr>")
    });

    // appelle la fonction de callback avec en paramètre les chaînes trouvées    
    success(equipes);
  });
}



// récupert le programme tv d'après un flux RSS donné
function get_equipe(nom_equipe, url, success){
  liste_joueurs = [];

  // modifie le titre de la page
  $('#page_equipe h1').html(nom_equipe);

  var $liste = $("#joueurs");

  // vide le classement
  $liste.empty();

  // récupert le classement de la division demandée
  $.get(url, function(data){
    var x = 0;
    
    // parcourt les équipes
    var $joueurs = $(data).find(".player-row");

    $joueurs.each(function(){
      var $el = $(this);
      var joueur = {};
      // récupert les informations du joueur en cours
      joueur.numero  = $el.find(".shirt-num").text();
      joueur.nom     = $el.find(".container-player-row a").text();
      joueur.place   = $el.find(".container-player-row div").text();
      joueur.link    = $el.find(".container-player-row a").prop('href');

      // ajoute le joueur à la liste des joueurs trouvés
      liste_joueurs.push(joueur);

      // affiche le joueur sur la page
      $liste.append("<li><a href='#' class='joueur_link' data-url='" + joueur.link + "' data-nom=\"" + joueur.nom  + "\">#" + joueur.numero + " " + joueur.nom + "</a></li>")
      
      // log(JSON.stringify(equipe));
    });

    // appelle la fonction de callback avec en paramètre les joueurs trouvés
    success(liste_joueurs);
  });
}



// récupert le programme tv d'après un flux RSS donné
function get_joueur(nom_joueur, url, success){
  joueur = {};

  // modifie le titre de la page
  $('#page_joueur h1').html(nom_joueur);

  var $liste = $("#joueur");

  // vide le classement
  $liste.empty();

  // récupert le classement de la division demandée
  $.get(url, function(data){
    var x = 0;
    
    // parcourt les équipes
    var $stats = $(data).find(".season-stats li");

    // récupert les informations du joueur en cours
    joueur.joues    = $($stats[0]).text();
    joueur.gagnes   = $($stats[1]).text();
    joueur.perdus   = $($stats[2]).text();
    joueur.goals    = $($stats[3]).text();
    joueur.assists  = $($stats[4]).text();
    joueur.points   = $($stats[5]).text();

    // affiche le joueur sur la page
    $liste.append("<li><a href='#'>Matchs joués <span class='ul-li-count'>" + joueur.joues + "</span></a></li>");
    $liste.append("<li><a href='#'>Matchs gagnés <span class='ul-li-count'>" + joueur.gagnes + "</span></a></li>");
    $liste.append("<li><a href='#'>Matchs perdus <span class='ul-li-count'>" + joueur.perdus + "</span></a></li>");
    $liste.append("<li><a href='#'>Goals <span class='ul-li-count'>" + joueur.goals + "</span></a></li>");
    $liste.append("<li><a href='#'>Assists <span class='ul-li-count'>" + joueur.assists + "</span></a></li>");
    $liste.append("<li><a href='#'>Points <span class='ul-li-count'>" + joueur.points + "</span></a></li>");
      
    // log(JSON.stringify(equipe));

    // appelle la fonction de callback avec en paramètre les joueurs trouvés
    success(joueur);
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
    
    // on affiche un loader
    $.mobile.loading( "show", {
      text: "Chargement...",
      textVisible: true,
      theme: 'b',
      textonly: false,
      html: ""
    });

    get_classement($(this).data('division'), function(){
      // affiche le classement
      document.location = "#page_classement";

      // raffraichit la liste
      // $("#page_classement .classement").table("rebuild");

      // puis on masque le loader
      $.mobile.loading("hide");
    });
  });



  // lors d'un clic sur une équipe
  $(document).on("click", ".equipe_link", function(){
    
    // on affiche un loader
    $.mobile.loading( "show", {
      text: "Chargement...",
      textVisible: true,
      theme: 'b',
      textonly: false,
      html: ""
    });

    get_equipe($(this).data('nom'), $(this).data('url'), function(){
      // affiche le classement
      document.location = "#page_equipe";

      // raffraichit la liste
      $('#page_equipe .joueurs').listview("refresh");

      // puis on masque le loader
      $.mobile.loading("hide");
    });
  });



  // lors d'un clic sur un joueur
  $(document).on("click", ".joueur_link", function(){
    
    // on affiche un loader
    $.mobile.loading( "show", {
      text: "Chargement...",
      textVisible: true,
      theme: 'b',
      textonly: false,
      html: ""
    });

    get_joueur($(this).data('nom'), $(this).data('url'), function(){
      // affiche le classement
      document.location = "#page_joueur";

      // raffraichit la liste
      // $('#joueur').listview("refresh");
      $('#joueur').listview({ splitTheme: "b" });

      // puis on masque le loader
      $.mobile.loading("hide");
    });
  });
}



function log(text){
  $('.console').append("<div>" + text + "</div>");
}