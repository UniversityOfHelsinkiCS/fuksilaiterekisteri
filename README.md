# Fuksilaiterekisteri

![Test and build staging-image](https://github.com/UniversityOfHelsinkiCS/fuksilaiterekisteri/workflows/Test%20and%20build%20staging-image/badge.svg) ![Build production-image](https://github.com/UniversityOfHelsinkiCS/fuksilaiterekisteri/workflows/Build%20production-image/badge.svg)

## How to run
Copy the repository to your machine and run ```npm run dev``` or ```docker-compose up```

1) Login as admin and enable registration
2) Login as fuksi to crete user
3) Login as admin and mark fuksi as eligible

## How to open registration

* Säädä kälissä päivämäärät oikein (kysy päivämäärät fuksilaitevastaavalta jos hän ei ole jo tehnyt tätä)
* Vaihda `current_year` ja `current_semester` tuotantokantaan käsin
	*  Semesterin saat Oodikoneen `sis-db`:n `semesters` taulusta, semester on aina jakelun avaamispäivän lukukausi (=vuosi 202x, syksy)
* Avaa rekisteröityminen

## Sanasto
- Opiskelija = kuka vaan jolla on HY:n (tai Avoimen) opiskelijatunnus.
- Oikeutettu opiskelija = opiskelija, jolla on oikeus fuksiläppäriin.
- Oikeus = oikeus saada fuksiläppäri
- Tehtävä = Oikeutettujen opiskelijoiden täytyy suorittaa osastonsa määrittelemät tehtävät jotta hän saa luvan läppäriin.
- Jakelija = Luovuttaa koneita, tarkistettuaan hakijan henkilöllisyyden ja luvan.
- Perijä = Laitteiden lainaehtorikkeiden selvittäjä sekä laiteperijä
- Työntekijä = Oman tiedekunnan opiskelijoiden hallinnointi ja seuranta
- Admin = Järjestelmähallinta, tilastojen seuranta

## Roolit

### Opiskelija
**Opiskelija kirjautuu Shibboletin avulla sisään ja voi nähdä yhden kolmesta näkymästä**
1) 'Olet oikeutettu läppäriin. Lue ehdot ja klikkaa "Haluan fuksiläppärin".'
-> Opiskelija näkee, ja voi aina tulla tarkistamaan tehtäviensä statuksen. Statukset päivittyvät automaattisesti.
-> Kun kaikki tehtävät on suoritettu, saa opiskelija automaattisesti sähköpostin asiasta.

2) 'Et ole oikeutettu läppäriin. **Syyt.**

3) 'Rekisteröinti on kiinni'

### Jakelija
**Jakelija syöttää kenttään opiskelijanumeron, jolloin järjestelmästä tarkistetaan onko opiskelija oikeutettu laitteeseen ja onko hänellä tehtävät suoritettuna**
* Oikeutettu:  
	=> Opiskelijan nimi ja muut tiedot näytetään sekä pyydetään jakelijaa tarkastamaan henkilöllisyystodistus.  
	=> Jakelija skannaa laitteen viivakoodin tai syöttää sarjanumeron viimeisen osan käsin.  
* Ei oikeutettu

### Työntekijä
* Näkee oman tiedekunnan laitetilasot
* Pystyy manuaalisesti merkkaamaan oman tiedekunnan opiskelijoita oikeutetuksi
* Pystyy manuaalisesti merkkaamaan oman tiedekunnan opiskelijoiden tehtäviä valmiiksi

### Admin
* Näkee kaikki laitetilastot
* Pystyy hallinnoimaan kättäjien eri statuksia
* Pystyy lähettämään massasähköpostia
* Pystyy avamaan ja sulkemaan rekisteröinnin sekä laittamaan aikarajat rekisteröimiselle ja laitteenhaulle
* Pystyy vaihtamaan laitteen sarjanumeron muotoa
* Pystyy vaihtamaan tiedekunnien yhteyshenkilöitä

### Perijä
* Näkee listan laitteen omaavista opiskelijoista, joilla on lainaehto rikkeitä
* Pystyy lähettämään valituille opiskelijoille massasähköpostia
* Pystyy muuttamaan perintätapausten tilaa manuaalisesti


## Eligibility & Tasks

**Opiskelija voi anoa laitetta, mikäli hän on oikeutettu (eligible) siihen. Opiskelija on oikeutettu, mikäli seuraavat pätee:**
* Opiskelija on ilmoittautunut läsnäolevaksi
* Opiskelija on hyväksytty matemaattisluonnontieteen tiedekunnan vastuulla olevaan kandiohjelmaan kuluvan vuoden päähaussa tai avoimen väylän haussa tai on hyväksytty Bachelor’s Programme in Science -kandiohjelmaan. Koneen saavat käyttöönsä myös ne, jotka ovat perustellusta syystä lykänneet opintojensa aloittamista.
* Opiskelija on ensimmäistä kertaa läsnä oleva opiskelija tiedekunnassa

**Opiskelija voi hakea laitteen, mikäli hän on oikeutettu siihen ja seuraavat tehtävät (taskit) on suoritettu:**
* Toistaiseksi opiskelija voi hakea laitteen jos hän on siihen oikeutettu ilman tehtävien suorittamista (koska Sisu)
* ~~Opiskelija on suorittanut Digitaidot orientaatio kurssin esim. DIGI-100A.~~
* ~~Opiskelija on ilmoittautunut kandiohjelmansa kurssille. Eri ohjelmien vaatimien ilmoittautumislogiikka löytyy [täältä.](https://github.com/UniversityOfHelsinkiCS/fuksilaiterekisteri/blob/master/server/models/user.js#L155)~~

Eligibility ja taskien tila tarkistetaan ja pävitetään aina oppilaan kirjautumisen yhteydessä. Lisäksi taskien tila tarkistetaan joka tasatunti, kun laitejakelu on vielä käynnissä.
