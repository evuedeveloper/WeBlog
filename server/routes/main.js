const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

/** GET / HOME */

router.get('', async (req, res) => {
  try {
    const locals = {
      title: "WeBlog",
      description: "Let us write tech blogs"
    }

    let perPage = 10;
    let page = req.query.page || 1;

    const data = await Post.aggregate([ { $sort: { createdAt: -1 } } ])
    .skip(perPage * page - perPage)
    .limit(perPage)
    .exec();

    // const count = await Post.count();
    const count = await Post.countDocuments({});
    const nextPage = parseInt(page) + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);

    res.render('index', { 
      locals,
      data,
      current: page,
      nextPage: hasNextPage ? nextPage : null,
      currentRoute: '/'
    });

  } catch (error) {
    console.log(error);
  }

});


/** GET / Post :id */

router.get('/post/:id', async (req, res) => {
  try {
    let slug = req.params.id;

    const data = await Post.findById({ _id: slug });

    const locals = {
      title: data.title,
      description: "Blogging Web App",
    }

    res.render('post', { 
      locals,
      data,
      currentRoute: `/post/${slug}`
    });
  } catch (error) {
    console.log(error);
  }

});


/** POST / Post - searchTerm */

router.post('/search', async (req, res) => {
  try {
    const locals = {
      title: "Search",
      description: "Let us write tech blogs"
    }

    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "")

    const data = await Post.find({
      $or: [
        { title: { $regex: new RegExp(searchNoSpecialChar, 'i') }},
        { body: { $regex: new RegExp(searchNoSpecialChar, 'i') }}
      ]
    });

    res.render("search", {
      data,
      locals,
      currentRoute: '/'
    });

  } catch (error) {
    console.log(error);
  }

});


/** GET / About */

router.get('/about', (req, res) => {
  res.render('about', {
    currentRoute: '/about'
  });
});


/**
 Test for getting contact
 Yes great it worked
*/

router.get('/contact', (req, res) => {
  res.render('contact', {
    currentRoute: '/contact'
  });
});

// function insertPostData() {
//   Post.insertMany([
//     {
//       "title": "Work-Life Balance?",
//       "body": "Though I haven't yet experienced life in tech, I'm a student at Jadavpur University and have faced the challenges of managing a demanding schedule. My daily routine involves waking up early and commuting long distances to attend classes and labs. Despite this, I prioritize learning to code, driven by my passion and the support of my peers and professors. I've realized that achieving a work-life balance hinges on dedication and willingness. These experiences keep me curious and excited about my future endeavors."
//     },    
//     {
//       "title": "UX/UI Design: Balancing Aesthetics with Functionality",
//       "body": "Creating a user interface that is both visually appealing and highly functional is a delicate balance that requires a deep understanding of user experience (UX) principles. The concepts of usability, consistency, and feedback are also important. Personally, I had the willingness to complete a course on the principles of UX/UI design, even though it's not technical, simply out of curiosity. I was eager to learn how people respond to visuals, how they are impacted by colors, the significance of design, and how companies build trust by providing a user-friendly experience. I loved this course, and if you want to discuss it further, we can certainly have a lengthy conversation about it. All I can say is that it was a great course, and I learned a lot from it!"
//     },
//     {
//       "title": "My Views on Peer Review and Technical Documentation",
//       "body": "I have personally worked with peers on many group projects, both technical and non-technical. Team spirit and constructive advice are common in both. However, technical documentation can benefit even more from peer review. This is because algorithms and implementations are always subject to drawbacks and/or improvements. When the requirements are for thousands of people, consultation at each step allows for criticism, alternatives, and out-of-the-box suggestions, which can be truly helpful in the end."
//     },
//     {
//       "title": "Why Simplicity Matters in Technical Content",
//       "body": "The ability to write clear, concise, and understandable technical content is crucial for effective communication in the tech industry. I've discussed the need for documentation, but let's focus on the importance of simplicity. Consider someone working on a logic they need to integrate into a project. After spending considerable time developing the logic, they decide to document it by referring to various sources and finalizing the solution. Now, imagine if they documented that logic directly as it is, without breaking it down into smaller sub-problems like they did when debugging. Would that be truly helpful, or would it be better if they documented it in a way that reflects their simple thought process? I believe that while it may take more time, the results would be far more beneficial, as the documentation would be understandable not only to experts but also to newcomers."
//     },
//     {
//       "title": "Why Document Technical Content?",
//       "body": "I remember an incident when I was working on a full-stack project and trying to integrate maps, but I got stuck. So, I decided to ask one of my seniors about possible solutions or the direction I should take. However, the first advice he gave me was that he didn't have enough context to understand what I was talking about. I took a moment and realized he was absolutely right. How can we expect someone to understand our needs based on assumptions, which can often be incorrect? The author must ensure the completeness of resources and provide sufficient documentation for others to refer to. I later learned how technical documentation is maintained, how track records, thought processes, and requirements are documented for future reference. This makes it easier for anyone new to quickly understand the project and simplifies the work for other developers, peers, and mentors. It was a great lesson, and I learned a lot from it!"
//     },
//     {
//       "title": "My Views on Non-Standard Problems",
//       "body": "Non-standard problems in competitive programming require creative thinking and a deep understanding of algorithms. These are problems that do not fit into typical categories like dynamic programming or graph theory, and even their implementation requirements differ. I personally feel that non-standard problems are those that don't immediately click or require more thought in the implementation phase. Dealing with them subconsciously helps improve our critical thinking, allowing us to approach future problems more effectively and quickly."
//     },
//     {
//       "title": "Game Theory",
//       "body": "Game theory is a mathematical framework for strategic decision-making and a powerful tool in algorithm design. Imagine a real-life scenario where you and your friend are playing a game with specific rules, and the defeat of any player can be determined by a single wrong move. But what if both players play optimally? Would you be able to figure out who will win? It's really interesting, isn't it? Let me know what factors you would consider to figure it out."
//     },
//     {
//       "title": "Greedy Algorithms: Intuition or Brute Force?",
//       "body": "Greedy algorithms are often seen as a simple approach to optimization problems, but their application requires careful consideration. I personally consider greedy algorithms to be the 'rebel of brute force.' The reason is that many steps involved in greedy algorithms are sometimes predefined and are meant to be followed with similar observations, often requiring critical proof (though not always). One typically learns them by solving multiple problems of increasing difficulty. You might find that the mathematical proofs you considered best, which we programmers often refer to as the 'best guess,' sometimes give incorrect answers, leading us to wonder about the mistake. However, in most cases, we end up accepting that there is a specific way to solve that particular type of problem. I generally try to learn from these instances and attempt future problems with improved accuracy and better 'best guesses.'"
//     },
//     {
//       "title": "Policy-Based Data Structures",
//       "body": "Policy-based data structures in C++ provide advanced capabilities beyond what standard containers offer. They are particularly helpful for operations on `ordered_set` from the GNU C++ library. I've seen their use in multiple LeetCode hards and in competitive programming questions to solve problems more efficiently than traditional methods, especially for dynamic calculations with much-improved time complexity due to the internally implemented red-black tree. One major use of this `pbds` implementation is for operations like finding the k-th largest element or counting elements in a range. I highly encourage you to read more about this on online platforms like GeeksforGeeks."
//     },
//     {
//       "title": "Introduction to MST",
//       "body": "Minimum Spanning Trees (MST) are a fundamental concept in graph theory, crucial for optimizing network designs. Two widely used algorithms for finding an MST are Kruskal’s and Prim’s, with implementations available on GeeksforGeeks. The logic behind each algorithm is explained in detail, along with their time complexities. In practical terms, MSTs are used in designing efficient communication networks, road systems, and other networked systems where cost minimization is important. Understanding and applying MSTs is essential for problem-solving in competitive programming and software engineering."
//     }
//   ]);
// }


insertPostData();


module.exports = router;
