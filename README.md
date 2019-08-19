# Fuksilaiterekisteri

## Sanasto
- Opiskelija = kuka vaan jolla on HY:n (tai Avoimen) opiskelijatunnus.
- Oikeutettu opiskelija = opiskelija, jolla on oikeus fuksiläppäriin.
- Oikeus = oikeus saada fuksiläppäri
- Tehtävä = Oikeutettujen opiskelijoiden täytyy suorittaa osastonsa määrittelemät tehtävät jotta hän saa luvan läppäriin.
- Lupa = Opiskelijalla, jolla on sekä oikeus, että kaikki tehtävät suoritettuna, on lupa saada fuksiläppäri.
- Arvostelija = Päivittävät tehtävästatuksia oppilaiden suoritettua tehtäviä.
- Jakelija = Luovuttaa koneita, tarkistettuaan hakijan henkilöllisyyden ja luvan.

## Roadmap
### v0.1
- Kannassa on lista oikeutetuista opiskelijoista.
- Shibboleth-kirjauduttuaan opiskelija näkee onko oikeutettu...
- ja voi ilmaista haluavansa koneen.
- Admin voi merkitä opiskelijalle luvan.
- Ohjelmisto kertoo jakelijalle onko opiskelijalla oikeus ja lupa
- Admin voi merkitä koneen luovutetuksi.

### v0.2
- tehtävätuki

## Käyttäjäkokemukset

### Opiskelija
**Kirjaudu Shibbolethin avulla sisään. (student id)**
1) 'Olet oikeutettu läppäriin. Lue ehdot ja klikkaa "Haluan fuksiläppärin".'
-> Opiskelija näkee, ja voi aina tulla tarkistamaan tehtäviensä statuksen. Arvostelijat päivittävät tehtävästatuksia suoritusten myötä.
-> Kun kaikki tehtävät on suoritettu, säpö 'olet jonotuslistalla numerolla #'. -> Opiskelija voi tarkistaa jonotusnumeronsa.
-> Kun kone on tarjolla, opiskelija saa noutotiedot säpönä.

2) 'Et ole oikeutettu läppäriin. **Syy.** Lisätietoja opintoesimies@cs.helsinki.fi'

### Arvostelija
**Kirjaudu Shibbolethin avulla sisään. (employee id)**
- raportointinäkymä, valitse osasto, valitse tehtävä, pastea lista opiskelijanumeroista (yksi opiskelijanumero per rivi), vahvista lähetys
- haku opiskelijanumerolla, näe hakijan osasto ja tehtävien status (jotta voidaan varmistaa status tarvittaessa)

### Lenovon jakelija
**Tarvitsee oman, shibbolethittoman APIn: saako tälle henkilölle (ks. henkkarit) antaa koneen?**
-> kysely hakijan opiskelijanumerolla -> jos oikeutettu, API vastaa nimellä, jos ei, API vastaa 'tehtävät suorittamatta' tai 'ei laiteoikeutta'. 
-> lisää laitteen numero ja oma luovuttajatunnus, vahvista laite luovutetuksi


### Admin
**Kaikki aiemmat. Lisäksi jonotuslistasivu, jossa myös mahdollisuus muuttaa vapaana olevien koneiden määrää. Oppilassivu, josta mahdollisuus nähdä ja muokata tehtävien statusta, oikeutta ja lupaa, luovutetun koneen tietoja.**


## Järjestelmälogiikka
- kirjautuessa tiedot shibbosta -> saa ilmoittautua jos täyttää ehdot

oikeus:
- "aito fuksi"
- tiedekunnalta opiskelijanumerot hyväksytyistä

lupa:
-ehops
-digitaidot? DIGI100A

- päivittäinen scripti tarkastaa puuttuvia lupia APIen kautta

## Muuta selvitettävää
- kuka luo tehtävät? devaajat suoraan kantaan?
	- voiko tehtävä olla osasuoritettu, vai onko se aina boolean
- gdpr?
- läppäreiden takaisinperintä?
- sovelluksen jatkokäyttö?
- adminille override-nappi, joka lisää opiskelijalle oikeuden ja/tai luvan

## Tietokanta
user:
- name
- student_id
- employee_id
- is_eligible
- receive_date
- is_distributor (näitä ei taideta saada kantaan)
- is_grader
- is_admin

distributor:
- distributor id
- name

delivery:
- student_id
- device_id
- handover_date
- serial_number
- handover_by (employee id or distributor id)

task:
- department
- description
- contact person email


## Below are the relevant fuksilaiterekisteri information
- The project is split into 2 parts: client and server while index.js in root works as the main file. The project contains no database dependant parts.
- ApiConnection is a custom redux middleware that is used in most toska software. It is used to simplify redux usage by wrapping axios.
- You can see redux example using apiConnection in client/components/MessageComponent. 
- Clone the repo, install node and run `npm install` to get started!
	- `npm start` To start the project in production mode use this command. It builds the client and then the server.
	- `npm run dev` To start the project in development mode use this command. It will start the server in hotloading mode.
	- `npm run lint` To clean all the little style flaws around your code.
	- `npm run stats` To create statistics on how big your project is.
