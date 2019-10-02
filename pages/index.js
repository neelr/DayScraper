import Layout from "../components/Layout";
import Card from "../components/Card";

export default class Index extends React.Component {
	render() {
		return(
			<Layout>
			<h1 className="title">DayScraper</h1>
			<p>Get quirky national holidays today!</p>
			<div className="container" style={{display:"flex",flexWrap:"wrap"}}>
				<p className="para">Some cool holidays today: <code className="code" id="days"></code>.</p>

				<p className="para">How to use it: Make a <em>POST</em> request to <strong>/day</strong> with either <em>random</em> to true for a single random day, or get a specific date with <em>date</em></p>
			</div>
			</Layout>
		)
	}
	componentDidMount () {
		axios.post('/day', {date:new Date()})
			.then((res)=> res.data.day ? document.getElementById("days").innerHTML = res.data.day.join(", ") : document.getElementById("days").innerHTML = "... there are none.")
			.catch((err)=> alert(err));
	}
}