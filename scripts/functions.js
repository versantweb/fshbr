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

// pour stocker toutes les informations que l'on récupert depuis le site
var divisions = [];

// pour stocker la division que l'on regarde 
var division_now = '';

// pour stocker l'équipe' que l'on regarde 
var equipe_now = '';

// pour stocker le joueur que l'on regarde 
var joueur_now = '';



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



/**
 * récupert le classement d'une division 
 * 
 * division : le nom de la division dont on veut récupérer les équipes et le classement
 * refresh : si TRUE, récupert le contenu depuis le site. si FALSE, prend la version en cache si disponible
 * success : fonction de callback en cas de réussite
 */
function get_classement(division, refresh, success){
  // récupert l'url du classement de la division demandée
  var url = urls.classement[division];

  // vérifie si la division en cours est déjà stockée
  var division_temp = "";
  $.each(divisions, function(index, element){
    if (element.nom == division){
      division_temp = element;
    }
  });

  // si la division n'est pas encore stockés, on la stock
  if (division_temp == ''){
    // on récupérera de toute façon depuis le site
    refresh = true;

    division_temp = {
      'nom': division,
      'equipes': []
    }
    divisions.push(division_temp);
  }

  // pour stocker les chaînes et leurs programmes
  var equipe = '';

  // modifie le titre de la page
  $('#page_classement h1').html("Classement " + division);

  var $liste = $("#page_classement .classement tbody");

  // vide le classement
  $liste.empty();

  // si on demande un raffraichissement depuis le site
  if (refresh){
    // on vide les équipes de la division
    division_temp.equipes = [];

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

        // stock l'équipe en cours dans la division
        division_temp.equipes.push(equipe);

        $liste.append("<tr class='equipe'><td><a href='#' class='equipe_link' data-url='" + equipe.link + "' data-nom='" + equipe.nom + "'>" + equipe.nom + "</a></td><td>" + equipe.joue + "</td><td>" + equipe.gagne + "</td><td>" + equipe.egalite + "</td><td>" + equipe.perdu + "</td><td>" + equipe.marques + "</td><td>" + equipe.encaisses + "</td><td>" + equipe.difference + "</td><td>" + equipe.points + "</td></tr>")
      });

      // définit la division en cours actuellement
      division_now = division_temp;

      // appelle la fonction de callback avec en paramètre les chaînes trouvées    
      success(division_temp.equipes);
    });
  }
  // si on prend les infos depuis le cache
  else{
    $.each(division_temp.equipes, function(index, equipe){
      $liste.append("<tr class='equipe'><td><a href='#' class='equipe_link' data-url='" + equipe.link + "' data-nom='" + equipe.nom + "'>" + equipe.nom + "</a></td><td>" + equipe.joue + "</td><td>" + equipe.gagne + "</td><td>" + equipe.egalite + "</td><td>" + equipe.perdu + "</td><td>" + equipe.marques + "</td><td>" + equipe.encaisses + "</td><td>" + equipe.difference + "</td><td>" + equipe.points + "</td></tr>")
    });

    // définit la division en cours actuellement
    division_now = division_temp;

    // appelle la fonction de callback avec en paramètre les chaînes trouvées    
    success(division_temp.equipes);
  }
}



/**
 * récupert la liste des joueurs d'une équipe donnée
 * 
 * nom_equipe : le nom de l'équipe dont on veut récupérer les joueurs
 * refresh : si TRUE, récupert le contenu depuis le site. si FALSE, prend la version en cache si disponible
 * url : l'url depuis laquelle on veut récupérer les données
 * success : fonction de callback en cas de réussite
 */
function get_equipe(nom_equipe, refresh, url, success){
  // vérifie si l'équipe en cours est déjà stockée et la récupert le cas échéant
  var equipe_temp = "";

  // vérifie si l'équipe est déjà stockée dans la division en cours
  if (Array.isArray(division_now.equipes)){
    $.each(division_now.equipes, function(index, equipe){
      if (equipe.nom == nom_equipe){
        equipe_temp = equipe;
      }
    });
  }

  // si l'équipe n'est pas encore stockée
  if (equipe_temp == ""){
    // on récupérera de toute façon depuis le site
    refresh = true;

    // on créé l'équipe
    equipe_temp = {
      'nom': nom_equipe,
      'link': url,
      'joueurs': []
    }

    // et on l'ajoute à la division en cours (si la division en cours existe)
    if (Array.isArray(division_now.equipes)){
      division_now.equipes.push(equipe_temp);
    }
  }
  // si les joueurs ne sont pas stockés dans l'équipe
  else if (!Array.isArray(equipe_temp.joueurs)){
    // on récupérera de toute façon depuis le site
    refresh = true;

    // on prépare la liste des joueurs de l'équipe
    equipe_temp.joueurs = [];
  }

  // modifie le titre de la page
  $('#page_equipe h1').html(nom_equipe);

  var $liste = $("#joueurs");
  
  // vide le classement
  $liste.empty();

  // si on demande un raffraichissement depuis le site
  if (refresh){
    // on vide les équipes de la division
    equipe_temp.joueurs = [];

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
        equipe_temp.joueurs.push(joueur);

        // affiche le joueur sur la page
        $liste.append("<li><a href='#' class='joueur_link' data-url='" + joueur.link + "' data-nom=\"" + joueur.nom  + "\">#" + joueur.numero + " " + joueur.nom + "</a></li>");
      });

      // définit l'équipe en cours actuellement
      equipe_now = equipe_temp;
      
      // appelle la fonction de callback avec en paramètre les joueurs trouvés
      success(equipe_temp.joueurs);
    });
  }
  // si on prend les infos depuis le cache
  else{
    $.each(equipe_temp.joueurs, function(index, joueur){
      $liste.append("<li><a href='#' class='joueur_link' data-url='" + joueur.link + "' data-nom=\"" + joueur.nom  + "\">#" + joueur.numero + " " + joueur.nom + "</a></li>");
    });
    
    // définit l'équipe en cours actuellement
    equipe_now = equipe_temp;
    
    // appelle la fonction de callback avec en paramètre les joueurs trouvés
    success(equipe_temp.joueurs);
  }
}



/**
 * récupert les statistiques d'un joueur donné
 * 
 * nom_joueur : le nom du joueur dont on veut récupérer les statistiques
 * refresh : si TRUE, récupert le contenu depuis le site. si FALSE, prend la version en cache si disponible
 * url : l'url depuis laquelle on veut récupérer les données
 * success : fonction de callback en cas de réussite
 */
function get_joueur(nom_joueur, refresh, url, success){
  // vérifie si le joueur en cours est déjà stocké et le récupert le cas échéant
  var joueur_temp = "";

  // vérifie si le joueur est déjà stocké dans l'équipe en cours
  if (Array.isArray(equipe_now.joueurs)){
    $.each(equipe_now.joueurs, function(index, joueur){
      if (joueur.nom == nom_joueur){
        joueur_temp = joueur;
      }
    });
  }

  // si le joueurs n'est pas stocké dans l'équipe en cours
  if (joueur_temp == ""){
    // on récupérera de toute façon depuis le site
    refresh = true;

    // on créé le joueur
    joueur_temp = {
      'nom': nom_joueur
    }

    // et on l'ajoute à l'équipe en cours (si l'équipe en cours existe)
    if (Array.isArray(equipe_now.joueurs)){
      equipe_now.joueurs.push(joueur_temp);
    }
  }
  // si le joueur est stocké mais pas ses statistiques
  else if(joueur_temp.joues == undefined){
    // on récupérera de toute façon depuis le site
    refresh = true;
  }

  // modifie le titre de la page
  $('#page_joueur h1').html(nom_joueur);

  var $liste = $("#joueur");

  // vide le classement
  $liste.empty();

  // si on demande un raffraichissement depuis le site
  if (refresh){
    // récupert le classement de la division demandée
    $.get(url, function(data){
      var x = 0;
      
      // parcourt les équipes
      var $stats = $(data).find(".season-stats li");

      // récupert les informations du joueur en cours
      joueur_temp.nom      = nom_joueur;
      joueur_temp.joues    = $($stats[0]);
      joueur_temp.gagnes   = $($stats[1]);
      joueur_temp.perdus   = $($stats[2]);
      joueur_temp.goals    = $($stats[3]);
      joueur_temp.assists  = $($stats[4]);
      joueur_temp.points   = $($stats[5]);

      // supprime le label des données récupérées
      joueur_temp.joues.find('label').remove();
      joueur_temp.gagnes.find('label').remove();
      joueur_temp.perdus.find('label').remove();
      joueur_temp.goals.find('label').remove();
      joueur_temp.assists.find('label').remove();
      joueur_temp.points.find('label').remove();

      // puis ne prend que le texte
      joueur_temp.joues = joueur_temp.joues.text();
      joueur_temp.gagnes = joueur_temp.gagnes.text();
      joueur_temp.perdus = joueur_temp.perdus.text();
      joueur_temp.goals = joueur_temp.goals.text();
      joueur_temp.assists = joueur_temp.assists.text();
      joueur_temp.points = joueur_temp.points.text();

      // affiche le joueur sur la page
      $liste.append("<li><span>Matchs joués</span><span class='ul-li-count'>" + joueur_temp.joues + "</span></li>");
      $liste.append("<li><span>Matchs gagnés</span><span class='ul-li-count'>" + joueur_temp.gagnes + "</span></li>");
      $liste.append("<li><span>Matchs perdus</span><span class='ul-li-count'>" + joueur_temp.perdus + "</span></li>");
      $liste.append("<li><span>Goals</span><span class='ul-li-count'>" + joueur_temp.goals + "</span></li>");
      $liste.append("<li><span>Assists</span><span class='ul-li-count'>" + joueur_temp.assists + "</span></li>");
      $liste.append("<li><span>Points</span><span class='ul-li-count'>" + joueur_temp.points + "</span></li>");

      // appelle la fonction de callback avec en paramètre le joueur trouvé
      success(joueur_temp);

      // définit le joueur en cours actuellement
      joueur_now = joueur_temp;
    });
  }
  // si on prend les infos depuis le cache
  else{
    // affiche le joueur sur la page
    $liste.append("<li><span>Matchs joués</span><span class='ul-li-count'>" + joueur_temp.joues + "</span></li>");
    $liste.append("<li><span>Matchs gagnés</span><span class='ul-li-count'>" + joueur_temp.gagnes + "</span></li>");
    $liste.append("<li><span>Matchs perdus</span><span class='ul-li-count'>" + joueur_temp.perdus + "</span></li>");
    $liste.append("<li><span>Goals</span><span class='ul-li-count'>" + joueur_temp.goals + "</span></li>");
    $liste.append("<li><span>Assists</span><span class='ul-li-count'>" + joueur_temp.assists + "</span></li>");
    $liste.append("<li><span>Points</span><span class='ul-li-count'>" + joueur_temp.points + "</span></li>");

    // appelle la fonction de callback avec en paramètre le joueur trouvé
    success(joueur_temp);

    // définit le joueur en cours actuellement
    joueur_now = joueur_temp;
  }
}



/**
 * Récupert les matchs du jour
 * url : l'url depuis laquelle on veut récupérer les données
 * success : fonction de callback en cas de réussite   */
function get_match_du_jour(url, success){
  var $liste = $("#matchs_live");

  // vide le classement
  $liste.empty();

  // récupert les matchs du jour
  $.get(url, function(data){
    var x = 0;
    
    // parcourt les équipes
    var $matchs = $(data).find(".match-live li");

    // s'il y a des matchs aujourd'hui
    if ($matchs.length > 0){

      // pour stocker les informations du match
      var $equipes = '';
      var equipe1 = '';
      var equipe1_img = '';
      var equipe2 = '';
      var equipe2_img = '';
      var score = '';
      var url = '';
      var date = '';


      // parcourt les matchs récupérés
      $matchs.each(function(){
        $match = $(this);

        // récupert la division
        division = "<h2 class='match_division'>" + $match.find('.div-name').html() + "</h2>";

        // récupert les équipes
        $equipes = $match.find('.first-games-teams');

        // traite l'équipe 1
        equipe1 = $($equipes[0]).find('img');
        equipe1_img = equipe1.attr('src');
        equipe1 = equipe1.attr('title');
        equipe1_el = "<img src='" + equipe1_img + "' alt=\"" + equipe1 + "\" class='match_equipe' />";

        // puis l'équipe 2
        equipe2 = $($equipes[1]).find('img');
        equipe2_img = equipe2.attr('src');
        equipe2 = equipe2.attr('title');
        equipe2_el = "<img src='" + equipe2_img + "' alt=\"" + equipe2 + "\" class='match_equipe' />";

        // récupert la date du match
        date = "<div class='match_date'>" + $match.find('.dateandtime').html() + "</div>";

        // puis le score
        score = $match.find('.score-live');
        if (score.length > 0){
          score = "<div class='match_score'>" + $(score[0]).html() + ' - ' + $(score[1]).html() + "</div>";
        }
        else{
          score = "<div class='match_score'>pas débuté</div>";
        }

        // puis l'url des détails du match
        url = $match.find('.score-games-teams a').attr('href');

        var $match_el = $("<li/>");
        $match_el.data('url', url);
        $match_el.append(division);
        $match_el.append(date);
        $match_el.append(equipe1_el);
        $match_el.append(score);
        $match_el.append(equipe2_el);
        $match_el.append("<div class='match_equipe_texte'><strong>" + equipe1 + "</strong> vs <strong>" + equipe2 + "</strong></div>");

        $liste.append($match_el);
      });
    }
    // s'il n'y a pas de matchs aujourd'hui
    else{
      $liste.append("<div>Pas de match aujourd'hui</div>");
    }


    // appelle la fonction de callback
    success();
  });
}



/**
 * Récupert le calendrier des matchs d'une divisions
 * url : l'url depuis laquelle on veut récupérer les données
 * success : fonction de callback en cas de réussite   */
function get_calendrier(url, success){
  var $liste = $("#calendrier");

  // vide le classement
  $liste.empty();

  // récupert les matchs du jour
  $.get(url, function(data){
    var x = 0;
    
    // parcourt les équipes
    var $matchs = $(data).find(".resul");

    // s'il y a des matchs aujourd'hui
    if ($matchs.length > 0){

      // pour stocker les informations du match
      var $equipes = '';
      var equipe1 = '';
      var equipe1_img = '';
      var equipe1_url = '';
      var equipe2 = '';
      var equipe2_img = '';
      var equipe2_url = '';
      var score = '';
      var url = '';
      var date = '';


      // parcourt les matchs récupérés
      $matchs.each(function(){
        $match = $(this);

        // récupert la division
        division = $match.find('.first label');
        division.find('a').remove();
        division = "<h2 class='match_division'>" + division.text(); + "</h2>";

        // récupert les équipes
        $equipes = $match.find('.tree-block');

        // traite l'équipe 1
        equipe1 = $equipes.find('.first-block');
        equipe1_img = equipe1.find('img').attr('src');
        equipe1_url = equipe1.find('label a').attr('href');
        equipe1 = equipe1.find('label a').text();
        equipe1_el = "<img src='" + equipe1_img + "' alt=\"" + equipe1 + "\" class='match_equipe' data-url='" + equipe1_url + "' />";

        // puis l'équipe 2
        equipe2 = $equipes.find('.td-block');
        equipe2_img = equipe2.find('img').attr('src');
        equipe2_url = equipe2.find('label a').attr('href');
        equipe2 = equipe2.find('label a').text();
        equipe2_el = "<img src='" + equipe2_img + "' alt=\"" + equipe2 + "\" class='match_equipe' data-url='" + equipe2_url + "' />";

        // récupert la date du match
        date = "<div class='match_date'>" + $match.find('.resul-date').html() + "</div>";

        var $match_el = $("<li/>");
        // $match_el.data('url', url);
        $match_el.append(division);
        $match_el.append(date);
        $match_el.append(equipe1_el);
        $match_el.append("<span class='vs'>vs</span>");
        $match_el.append(equipe2_el);
        $match_el.append("<div class='match_equipe_texte'><strong>" + equipe1 + "</strong> vs <strong>" + equipe2 + "</strong></div>");

        $liste.append($match_el);
      });
    }
    // s'il n'y a plus de match à jouer
    else{
      $liste.append("<div>Plus de match à jouer</div>");
    }


    // appelle la fonction de callback
    success();
  });
}



function init(){
  // met la page en 100% de haut
  $(document).on("pageshow", setRealContentHeight);

  // charge le menu
  $(document).on("pageshow", function(){
    $(".nav-menu").load("menu.html", function(){
      $(".nav-menu").panel();
      $(".nav-menu ul").listview();
      $(".nav-menu").trigger("updatelayout");
    });
  });



  // lors du chargement de la page du classement
  $(document).on("click", ".nav-menu a.page_divisions", function(){
    $('#page_divisions h1').text('Classement');
    $("#page_divisions").trigger("updatelayout");
    $(".nav-menu").panel("close");
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

    get_classement($(this).data('division'), false, function(){
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

    get_equipe($(this).data('nom'), false, $(this).data('url'), function(){
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

    get_joueur($(this).data('nom'), false, $(this).data('url'), function(){
      // affiche le classement
      document.location = "#page_joueur";

      // raffraichit la liste
      $('#joueur').listview({ splitTheme: "b" });
      $('#joueur').listview("refresh");

      // puis on masque le loader
      $.mobile.loading("hide");
    });
  });



  // lors d'un clic sur le bouton "raffraichir" d'un classement d'une division
  $(document).on("click", "#page_classement .refresh", function(){
    // on affiche un loader
    $.mobile.loading( "show", {
      text: "Chargement...",
      textVisible: true,
      theme: 'b',
      textonly: false,
      html: ""
    });

    // on raffraichit les données depuis le site
    get_classement(division_now.nom, true, function(){
      // puis on masque le loader
      $.mobile.loading("hide");
    });
  });



  // lors d'un clic sur le bouton "raffraichir" d'un classement d'une division
  $(document).on("click", "#page_equipe .refresh", function(){
    // on affiche un loader
    $.mobile.loading( "show", {
      text: "Chargement...",
      textVisible: true,
      theme: 'b',
      textonly: false,
      html: ""
    });

    // on raffraichit les données depuis le site
    get_equipe(equipe_now.nom, true, equipe_now.link, function(){
      // raffraichit la liste
      $('#page_equipe .joueurs').listview("refresh");

      // puis on masque le loader
      $.mobile.loading("hide");
    });
  });



  // lors du chargement de la page des matchs live
  $(document).on("click", ".nav-menu a.page_matchs_live", function(){
    // on affiche un loader
    $.mobile.loading( "show", {
      text: "Chargement...",
      textVisible: true,
      theme: 'b',
      textonly: false,
      html: ""
    });

    // on raffraichit les données depuis le site
    get_match_du_jour("http://www.fshbr.ch/", function(){
      // raffraichit la liste
      $('#page_matchs_live .matchs_live').listview("refresh");

      // puis on masque le loader
      $.mobile.loading("hide");
    });
  });



  // lors du chargement de la page du calendrier
  $(document).on("click", ".nav-menu a.page_calendrier", function(){
    $('#page_divisions h1').text('Calendrier');
    $("#page_divisions").trigger("updatelayout");
    $(".nav-menu").panel("close");
    
//     // on affiche un loader
//     $.mobile.loading( "show", {
//       text: "Chargement...",
//       textVisible: true,
//       theme: 'b',
//       textonly: false,
//       html: ""
//     });

//     // on raffraichit les données depuis le site
//     get_calendrier("http://www.fshbr.ch/calendrier/index/3", function(){
//       // raffraichit la liste
//       $('#page_calendrier .calendrier').listview("refresh");

//       // puis on masque le loader
//       $.mobile.loading("hide");
//     });
  });
}



function log(text){
  $('.console').append("<div>" + text + "</div>");
}