#prosjektnavn


Dette prosjektet er basert på Bord4s  app template for å lage full stack Angular sites.

#Hvor skal jeg jobbe?

For Angular-apps jobber du også i views-mappen og undermapper i script-mappen (controllers etc) og i partials mappen.

Og dett var dett!

Du skal **ALDRI** jobbe i index.html. Den blir generert hver gang det gjøres endring i main.html eller andre filer.

index.html genereres ved at base.html bakes sammen med main.html - begge filene hentes fra partials-mappen - der kan du også legge header.html og footer.html

#Tips og triks

##CSS-filer i bower-komponenter

Hvis du har css-filer i bower-componenter som du vil importere så må de renames til scss.
Det gjør du ved å kjøre: `grunt copy:cssAsScss`

Da kan du importere i din main.scss f.eks. slik
`@import 'leaflet/dist/leaflet';`


#Videreutvikling av selve app-templaten

*  Pass på å bare utvikle i _templates-folderen om du skal endre på templates.
*  Rediger bower.json og legg inn rett app_type for å teste
*  Kjør ` grunt clean:templatesdestination copy:vanillatemplate copy:selectedtemplate serve` for å se endringer
*  Før deploy til app-template-repositoriet må du alltid kjøre ` grunt clean:templatesdestination `



#Gammel docs:





Bergens Tidendes applikasjonsmal
============

Avhengigheter
-----------------

Node: [http://nodejs.org/]

Yeoman: [http://yeoman.io/]

Composer: [Installasjonsinstruksjoner for Mac via Homebrew](https://getcomposer.org/doc/00-intro.md#globally-on-osx-via-homebrew-)

Slim: (http://slimframework.com/), [Enkelt oppsett](https://github.com/codeguy/Slim-Skeleton)


Opprette nytt prosjekt/app
--------------------------

For å lage nytt prosjekt basert på Bord4s app-template bør du bruke [bord4-generatoren](https://github.com/BergensTidende/generator-bord4).

Les på [bord4-generator](https://github.com/BergensTidende/generator-bord4)-siden for info om hvordan før du starter. 

Lag en folder hvor appen din skal bo, cd inn i den

```bash
$ yo bord4
```

Om du må kjøre npm med sudo

sudo chown -R `whoami` ~/.npm
sudo chown -R `whoami` /usr/local


Kopiere et eksisterende prosjekt
--------------------------------

Bytt ut mittprosjektnavn med navnet på prosjektet på Github og kjør følgende. 

```
git clone git@github.com:BergensTidende/mittprosjektnavn.git mittprosjektnavn
cd mittprosjektnavn

```


Oppsett av prosjektet på lokal maskin
-------------------------------------

Forutsetter at du har clonet et eksisterende prosjekt eller opprettet et nytt med bord4-generatoren.

2. Sørg for å ha følgende linjer i filen `~/.bash_profile` på din Mac (bytt ut med ditt brukernavn under) slik at grunt-kommandoene kan logge seg på bttux:

```
export LISA_KEY_LOCATION=/Users/dittbrukernavn/.ssh/id_rsa
export LISA_KEY_PASS=dittnøkkelpassord_om_du_har
export LISA_USERNAME=resin
```

7. Om du trenger API. Installer først composer om du ikke har den
```
sudo curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer
```
Kjør så denne kommandoen fra prosjektets api-mappe
```
composer create-project slim/slim-skeleton api
```


Fixer for problemer ved installasjon
------------------------------------
Ekstra ting som må installeres ved bruk av angular-generator
```
sudo gem update
sudo gem install compass
npm install -g karma-jasmine
```
Får du problemer med oppgradering av php med homebew
```
sudo chown -R `whoami` /usr/local
```

Ressurser
-----------------
[Inquirer.js - CLI brukt av yeoman](https://github.com/SBoudrias/Inquirer.js)

##Grunt-kommandoer

`grunt serve`   
Kjør dev-server slik at du kan finne siten på http://127.0.0.1:9000 (har livereload)

`grunt build`   
Bygg en optimalisert versjon av siten i dist-mappen

`grunt serve:dist`   
Vis den pakkede/dist-versjonen slik at du kan finne den optimaliserte siten på http://127.0.0.1:9000

##Viktig ved endring
**OBS:** Vær nøye med å ikke endre på denne linjen i index.html. Den blir automatisk erstattet med kode for den byggete versjonen av main ved dist/deploy ved hjelp av kommandoen regexp-replace i grunt-fila:   
`<script data-main="scripts/main" src="bower_components/requirejs/require.js"></script>` 

##Konfigurasjon av app-variabler for ulike environments (dev, prod, stage)

1. Alle config-verdier som appen skal bruke kan du legge i /config/config.js under constant -> configration. 

2. Dersom verdiene skal være ulike for ulike deploy-envs (eks stage, prod osv) så legg dem i json-filene under /config/environments OG legg inn parameternavnene i config.js-fila slik

```
apiserver: '@@apiserver',
```

3. Når du kjører grunt serve eller build:stage og build:deploy så blir automatisk en config-fil bygget og lag inn under /app/scripts/services/config.js. 

4. Du får tak i config-variablene ved å injecte 'configuration' i f.eks. en controller slik: 

```
 controllers.controller( 'MainCtrl', ['$scope', 'configuration', function ( $scope, configuration) {
 	  //dette vil skrive ut alle configvariablene dine
 	  console.log(configuration);

 	  //og du kan bruke dem i templates slik
	  $scope.config = configuration;
  }]);

```

## Dokumentasjon på direktiver, services, filters etc.


### Direktiver

#### Xstream video

1. Inkluder direktivet et sted i domen der du vil ha playeren: 
```
 <xstreamvideo videodata="playerdata"></xstreamvideo>
```
der playerdata er et objekt definert på $scope i controlleren. Evt kan du angi metadata direkte slik:
```
 <xstreamvideo videodata="{'currenttime': 0, 'videoid': 32349, 'vptags': 'sport'}"></xstreamvideo>
```

#### Annonser

Annonser ligger inne som standard i app-template. 

Dersom du trenger å endre annonse-koder/tags så gjør du det index.html. Du trenger ulike tags for mobil, desktop og tablet og legger dem inn slik 

```
 <btads 
      adid="ad_1"
      desktopUrl="http://adserver.adtech.de/addyn|3.0|995.1|3135379|0|1744|ADTECH;cookie=info;alias=btny_nyh_toppbanner_980x150;loc=100;target=_blank;key=key1+key2+key3+key4;grp=[group];misc="
      mobileUrl="http://a.adtech.de/addyn/3.0/995.1/0/0/-1/ADTECH;loc=100;grp=[group];alias=BT_MobilWeb_Nyheter-Top-5;misc=" 
      tableturl="http://adserver.adtech.de/addyn|3.0|995.1|3052574|0|3218|ADTECH;cookie=info;alias=Lesebrett_BT_Fors_Toppbanner_980x300;loc=100;target=_blank;key=key1+key2+key3+key4;grp=[group];misc=">
    </btads>
```

**Annonse-rigget krever følgende filer: **

* Bower: htmlparser, mobile-detect og postscribe (er inkludert i bower.json)
* Silsett: styles/common/_ads.scss
* Direktiv: scripts/directives/btadsDir.js


#### Siste artikler fra BT.no-seksjon

Du kan hente inn siste artikler fra BT via en api-proxy vi har laget. Den kjører per nå på `www.bt.no/spesial/maktibergen/api/latest/`, men skal flyttes til egen API-url.

I kallet getLatest kan du spesifisere seksjonsid og antall artikler du vil hente. Det er alltid de siste publiserte som returneres.

**I controller: **
```

 latestArticleService.getLatest(SEKSJONSID, ANTALL).then(function(data) {
	$scope.articles = data;
  })

```

**I view: **

```
<latestarticles articles=articles showlead="false" offset="0" limit="13"></latestarticles>
```

**Siste artikler-rigger krever:**

* Tilgang på serverapi, se service-scriptet for url.
* services/latestArticlesService.js (må aktiveres i index.js)
* directives/latestarticles.js (må aktiveres i index.js)
* views/directives/latestarticles.html (kan selvsagt endres)
* equalHeight-directiv: for å få like høye diver med artikler. Ikke obligatorisk.
* filters/offset.js for å kunne begynne et annet sted enn siste artikkel. Eks på artikkel 2. 


#### Equal height directiv - slik får du lik høyde på div'ene. 

Brukes for å få lik høyde på div'er i et grid med ng-repeat, eks til siste artikler. Legger til events på bildelasting for å finne ut når ng-repeat er ferdig. 

I attributten css-equal-height legger du inn klassenavnet til selve diven som skal måles. 
Når ng-repeat er ferdig og alle bilder er lastet, henter den ut høyde på alle diver og setter alle til høyden av den høyeste. 

**Eksempel: **
```
<section class="row" >

	<div class="latestarticle col-md-3 col-sm-4 col-xs-12" css-equal-height="latestarticle" ng-repeat="a in articles | limitTo: limit | offset: offset" >
		 <a  href="{{a.url}}">
	       	<div ng-show="a.image != ''" style="position:relative" class="greyscale">
	       		<img ng-src="{{a.image_380}}" alt="..." class="articleimage img-responsive">
	       		<span ng-show="a.paywall == 'closed'" class="paywall_icon" title="Låst">l</span>
	       	</div>
	       	<div>
	        	<h4 class="media-heading"><span class="square"></span> {{a.title}}</h4>
	        	<p ng-if="showlead">{{a.lead}}</p>
	        </div>
	    </a>
	</div>
</section>
```

### Filters

#### Offset

Brukes for å hente fra et visst punkt i array f.eks ved siste artikler. 

Eks: 

```
<div ng-repeat="a in articles | limitTo: limit | offset: myoffset" >

```

## Crawler for å gi Facebook det de vil ha.

Det ligger en eksempel php-crawler i hovedmappen. 

Installer med composer i API-mappen først: 

* `composer install`
* Rediger så crawler.php "to fit your needs"
* Pass på at du redigerer .htaccess og dumper den på server. 
* Test med Facebook [Open Graph Debug](https://developers.facebook.com/tools/debug/)

##Deploy

1. Sjekk at du har ssh-connection til serveren med denne kommandoen:
`grunt sshexec`

1. Sjekk at `server_folder` er angitt i bower.json-fila slik at filene havner rett sted ved deploy. Dette er altså mappenavnet som blir del av urlen (eks: http://multimedia.bt.no/prosjektnavn)

1. Husk å bygge prosjektet først og sjekk bygget først med kommandoen:
`grunt build:dev serve:dist`

1. Når du er fornøyd med builden, så kan du dytte filene over til listatest (staging) ved å kjøre følgende kommando (browseren åpnes når overføringen er komplett slik at du kan se at det fungerte):
`grunt build:stage deploy:stage`

1. For å deploye til server (multimedia.bt.no/*server_folder*) så kjør følgende kommando. **OBS***: skriver over alt som ligger i katalogen!
`grunt build:prod deploy:prod`

1. For å pushe den versjonen du deployet til github slik at det blir opprettet en tag med versjonsnummer, kjør følgende kommando etter deploy:
`grunt push`
Les mer om ulike push-kommandoer her: [https://github.com/JonnyBGod/grunt-push-release](https://github.com/JonnyBGod/grunt-push-release)

1. Dersom du har et api i mappen `api` kan du pushe ut det ved hjelp av disse kommandoene: 
`grunt deploy:stageapi` og `grun deploy:prodapi`

(Obs pusher ikke vendor-mappen med php-components)

#Stiler etc

#### BT-Bootstrap
App-templaten er satt opp med Twitter Bootstrap og en del BT-overrides av farger og fonter.

Det brukes SASS som kompileres til CSS automatisk.

Lager du nytt prosjekt skal du som regel bare røre rundt i `/app/styles/main.scss`.

#### Bruke CSS fra importerte bower-componenter

Dersom du har bower-componenter som inneholder css må du legge dem inn i index.html for å få dem bygget sammen med resten. F.eks. slik (her er ng-grid inkludert):
```
<!-- build:css css/build.css -->

<link rel="stylesheet" href="bower_components/ng-grid/ng-grid.min.css">
<link rel="stylesheet" href="css/main.css">

<!-- endbuild -->
```
