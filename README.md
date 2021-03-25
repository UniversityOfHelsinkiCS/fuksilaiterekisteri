# Fuksilaiterekisteri

![Test and build staging-image](https://github.com/UniversityOfHelsinkiCS/fuksilaiterekisteri/workflows/Test%20and%20build%20staging-image/badge.svg) ![Build production-image](https://github.com/UniversityOfHelsinkiCS/fuksilaiterekisteri/workflows/Build%20production-image/badge.svg)

## How to run
Copy the repository to your machine and run ```npm run dev``` or ```docker-compose up```

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
