#Bord4 Daily template

**WHAT IS THIS?** A highly opinionated daily graphics template for small, embeddable data journalism projects at Bergens Tidende, Norway. Docs are in Norwegian, but feel free to have look at the code.

Highly inspired by the works of the [NPR Visuals Team](https://github.com/nprapps)

Bord4s mini app template for å lage iframe embeds.

##Konfigurasjon

Grunt-scriptene er avhengig av at du har satt en del environment variables på maskinen din (passord etc). Disse må du sette (og helst legge inn i din `~/.bash_profile` fil på Macen):

Yeoman-generatoren lager filen project.json med variabler som grunt-scriptene etc trenger. Her ligger info om prosjektets navn, server-folder og hva slags type app det er.

```

#settings for å deploye til PROD
export PROD_HOSTNAME=prod.domain.tld
export PROD_USERNAME=prod_server_ssh_username
export PROD_KEY_LOCATION=/Users/dittbrukernavn/.ssh/id_rsa
export PROD_KEY_PASS=dittnøkkelpassord_om_du_har
export PROD_BASE_PATH=/server/base/folder
export PROD_BASE_URL=http://www.bt.no/spesial/

#settings for å deploye til STAGE
export STAGE_HOSTNAME=prod.domain.tld
export STAGE_USERNAME=prod_server_ssh_username
export STAGE_KEY_LOCATION=/Users/dittbrukernavn/.ssh/id_rsa
export STAGE_KEY_PASS=dittnøkkelpassord_om_du_har
export STAGE_BASE_PATH=/server/base/folder
export STAGE_BASE_URL=http://staging.server.no/

#Andre variabler
export CACHE_PURGE_URL=http://cache.purge.server

```

Du kan lagre teksten over i en fil som heter `appsettings.sh` som du legger i din brukermappe på Macen (IKKE i et repository). Så kan du kjøre:

`cat appsettings.sh >> .bash_profile`

Da har du alle settings tilgjengelig hver gang du bruker app-templaten. Husk å sjekke `.bash_profile` at alt er rett.

#Bruke daily-templaten

For å opprette et nytt prosjekt, bruk bord4-generatoren (yeoman) som tar seg av dette automagisk.
Det er viktig at du står i daily graphics storage først.

##Hvor skal jeg jobbe med prosjektet mitt?

Du jobber i:

*  scripts/main.js
*  styles/main.scss
*  partials/main.html
*  og mapper du evt lager selv.

## Åpne prosjektet

For å se det du holder på med i nettleser: `grunt serve`

##Preview av iframe

For å se hvordan iframe-innholdet ditt ser ut i ulike størrelser og med pym.js så fyr opp følgende url i nettleseren: http://127.0.0.1:9000/parent.html

#Publisering

* Til stage: `grunt build:stage deploy:stage`
* Til prod: `grunt build:prod deploy:prod`

#Embed i artikkel
Du bruker [Daily Graphics Embedder](https://github.com/BergensTidende/doku4/blob/master/DAILYGRAPHICS.md).

For å fyre opp den kan du bruke kommandoen:
`grunt embed`



##Tips og triks

###CSS-filer i bower-komponenter

Hvis du har css-filer i bower-componenter som du vil importere så må de renames til scss.
Det gjør du ved å kjøre: `grunt copy:cssAsScss`

Da kan du importere i din main.scss f.eks. slik
`@import 'leaflet/dist/leaflet';`


#Utvikling av daily-templaten (malene)


##Installere daily-template for å jobbe på selve malene

1. Clon bord4-app-template fra Github
2. Kjør `npm install`
3. Rediger `project.json` og legg inn den app_type som du vil jobbe med
4. Kjør `grunt workon:[map|graphic|vanilla]` for å aktivere malen du har valgt
5. Kjør `bower install`


##Endre på malene/daily-templaten

*  Kjør ` grunt workon:[map|graphic|vanilla]` for å aktivere templaten du skal jobbe på
*  Kjør evt `bower install` om du har lagt til nye ting i bower.json-filen for templaten
*  Kjør `grunt serve` for å se prosjektet med den valgte templaten
*  Du kan nå redigere de js/scss/html-filene som ligger i app-foldere og se alt du gjør.
*  OBS: Når du er ferdig må du kopiere den oppdaterte malen tilbake til `_templates`-folderen. Det gjør du ved å bruke kommandoen ` grunt save:[map|graphic|vanilla]`. Du OVERSKRIVER da de filene i templates-folderen du har endret og samtidig blir app-folderen rensket slik at du kan sjekke inn. 

