# Fuksilaiterekisteri

![Test and build staging-image](https://github.com/UniversityOfHelsinkiCS/fuksilaiterekisteri/workflows/Test%20and%20build%20staging-image/badge.svg) ![Build production-image](https://github.com/UniversityOfHelsinkiCS/fuksilaiterekisteri/workflows/Build%20production-image/badge.svg)

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

## Below are the relevant fuksilaiterekisteri information
- The project is split into 2 parts: client and server while index.js in root works as the main file. The project contains no database dependant parts.
- ApiConnection is a custom redux middleware that is used in most toska software. It is used to simplify redux usage by wrapping axios.
- You can see redux example using apiConnection in client/components/MessageComponent. 
- Clone the repo, install node and run `npm install` to get started!
	- `npm start` To start the project in production mode use this command. It builds the client and then the server.
	- `npm run dev` To start the project in development mode use this command. It will start the server in hotloading mode.
	- `npm run lint` To clean all the little style flaws around your code.
	- `npm run stats` To create statistics on how big your project is.
