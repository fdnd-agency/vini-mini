<h2>Notities</h2>

<h3>GET</h3>

<p>Een overzicht van alle <em>notities</em> bij een <em>persoon</em>. Een selectie zonder <em>persoonId</em> resulteert in een lege selectie.</p>

<ul>
<li><a href="/api/v1/notities">/api/v1/notities</a></li>
<li><a href="/api/v1/notities?id=clemozv3c3eod0bunahh71sx7">/api/v1/notities?id=clemozv3c3eod0bunahh71sx7</a></li>
</ul>

<h3>POST</h3>

<p>Voeg een nieuwe <em>notitie</em> toe bij een bestaand <em>persoon</em>. Deze
route verwacht een als payload meegestuurd JSON object met de volgende structuur:</p>

<pre><code>
&lbrace;
	"titel": "Het is weer een notitie",
	"beschrijving": "Het is nog een test", 
	"afgerond": false, 
	"datum": "1978-11-20T09:00:00Z", 
	"herinnering": ["2023-11-20T09:00:00Z","2023-11-22T09:00:00Z"], 
	"persoonId": "clemozv3c3eod0bunahh71sx7" // Pepijn
&rbrace;
</code></pre>

<ul>
  <li><a href="/api/v1/notities">/api/v1/notities</a></li>
</ul>