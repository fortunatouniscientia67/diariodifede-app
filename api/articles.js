export default async function handler(req, res) {
  try {
    const response = await fetch(
      'https://public-api.wordpress.com/wp/v2/sites/40932416/posts?per_page=10&status=publish&orderby=date&order=desc',
      { headers: { 'Accept': 'application/json' } }
    );
    const posts = await response.json();
    const articles = posts.map(p => ({
      id: p.id,
      title: p.title.rendered.replace(/&#8217;/g,"'").replace(/&#8220;/g,'"').replace(/&#8221;/g,'"').replace(/&mdash;/g,'—').replace(/&rsquo;/g,"'"),
      excerpt: p.excerpt.rendered.replace(/<[^>]+>/g,'').trim(),
      link: p.link,
      date: p.date
    }));
    res.setHeader('Cache-Control', 's-maxage=300');
    res.json(articles);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
