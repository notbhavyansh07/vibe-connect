const User = require('../models/User');
const Post = require('../models/Post');

exports.getVibeMatches = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: "Email required" });

    // Find current user's most used tag
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const recentPost = await Post.findOne({ authorId: user._id, tag: { $exists: true } }).sort({ createdAt: -1 });
    const userTag = recentPost ? recentPost.tag : null;

    let matches;
    if (userTag) {
      // Find other users who used this tag
      const similarPosts = await Post.find({ tag: userTag, authorId: { $ne: user._id } })
        .populate('authorId', 'name handle image')
        .limit(3);
      matches = similarPosts.map(p => p.authorId).filter((v, i, a) => a.findIndex(t => t._id.toString() === v._id.toString()) === i);
    }

    // Fallback: Random users if no tag match
    if (!matches || matches.length === 0) {
      matches = await User.find({ email: { $ne: email } }).limit(3);
    }

    res.status(200).json(matches);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.enhanceVibe = async (req, res) => {
  try {
    const { text, style } = req.body;
    if (!text || text.trim() === '') {
      return res.status(400).json({ error: "Text is required" });
    }

    const styles = {
      cyberpunk: `[REBOOTING SYSTEM...] 🤖 %TEXT% [STAY GLITCHY] ⚡ #cyberpunk #neon`,
      lofi: `~ lost in the clouds ~ ☁️ %TEXT% ~ chill mode active ~ 🎧 #lofi #aesthetic`,
      minimalist: `Pure mood: %TEXT% . #minimal #simple`,
      dark_academia: `The ink runs dry, but the thoughts remain: %TEXT% 🏛️📜 #darkacademia`,
      vaporwave: `Ｖｉｂｉｎｇ　ｔｏ：　%TEXT% 🌴🐬✨ #vaporwave #retro`
    };

    const selectedStyle = style && styles[style] ? styles[style] : styles.lofi;
    const enhancedText = selectedStyle.replace('%TEXT%', text);

    res.status(200).json({ enhancedText });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.generateHashtags = async (req, res) => {
  try {
    const { text } = req.body;
    const words = text.toLowerCase().split(/\s+/).filter(w => w.length > 4);
    const baseTags = ['vibe', 'connect', 'aesthetic', 'mood'];
    const dynamicTags = words.slice(0, 3);
    const finalTags = [...new Set([...baseTags, ...dynamicTags])].map(t => `#${t}`).join(' ');

    res.status(200).json({ hashtags: finalTags });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.analyzeVoiceTone = async (req, res) => {
  try {
    const { duration } = req.body; // Simulated input
    
    // Logic: Map voice duration/energy to a style
    const themes = ['cyberpunk', 'lofi', 'minimalist', 'dark_academia', 'vaporwave'];
    const randomIndex = Math.floor(Math.random() * themes.length);
    const selectedStyle = themes[randomIndex];
    
    res.status(200).json({ 
        style: selectedStyle,
        message: `Your voice has a ${selectedStyle} frequency today. Tuning your aesthetic...`,
        confidence: 0.95
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSongRecommendation = async (req, res) => {
  try {
    const { email } = req.query;
    let vibe = "lo-fi chill";
    
    if (email) {
      const user = await User.findOne({ email });
      if (user) {
        const recentPost = await Post.findOne({ authorId: user._id }).sort({ createdAt: -1 });
        if (recentPost && recentPost.content) {
          const lowerText = recentPost.content.toLowerCase();
          if (lowerText.includes('gym') || lowerText.includes('workout') || lowerText.includes('pump')) vibe = 'hype rap / phonk';
          if (lowerText.includes('sad') || lowerText.includes('alone') || lowerText.includes('tears')) vibe = 'sad lo-fi';
          if (lowerText.includes('party') || lowerText.includes('club') || lowerText.includes('dance')) vibe = 'EDM / house';
          if (lowerText.includes('nature') || lowerText.includes('hike') || lowerText.includes('peace')) vibe = 'acoustic indie';
        }
      }
    }

    // AI Simulated Song Recommender mapping vibes to tracks
    const songDatabase = {
      'hype rap / phonk': { title: 'Murder In My Mind', artist: 'Kordhell' },
      'sad lo-fi': { title: 'Jocelyn Flores', artist: 'XXXTENTACION' },
      'EDM / house': { title: 'We Found Love', artist: 'Rihanna ft. Calvin Harris' },
      'acoustic indie': { title: 'Holocene', artist: 'Bon Iver' },
      'lo-fi chill': { title: 'Snowman', artist: 'WYS' }
    };

    const recommendation = songDatabase[vibe] || songDatabase['lo-fi chill'];
    res.status(200).json({ vibe, recommendation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPopularHashtags = async (req, res) => {
  try {
    // Simulated AI analyzing site sentiment to produce new viral tags
    const simulatedAItags = [
      { tag: "CyberPunkVibes", score: 98 },
      { tag: "DigitalSunset", score: 92 },
      { tag: "NeonDreams", score: 87 },
      { tag: "LoFiMoments", score: 85 },
      { tag: "MidnightThoughts", score: 80 }
    ];
    res.status(200).json(simulatedAItags);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getVibeAvatarPrompt = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: "Email required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    // Analyze last 10 posts to create an art prompt
    const lastPosts = await Post.find({ authorId: user._id }).sort({ createdAt: -1 }).limit(10);
    const contentText = lastPosts.map(p => p.content).join(' ');

    // Logic to determine aesthetic based on keywords
    let promptTheme = "a futuristic cyberpunk cityscape in neon pink and cyan";
    if (contentText.toLowerCase().includes('lofi') || contentText.toLowerCase().includes('chill') || contentText.toLowerCase().includes('slow')) {
      promptTheme = "a cozy lo-fi bedroom window at night with purple clouds and a large crescent moon";
    } else if (contentText.toLowerCase().includes('nature') || contentText.toLowerCase().includes('green') || contentText.toLowerCase().includes('forest')) {
      promptTheme = "a lush ethereal enchanted forest with floating lanterns and glowing moss";
    } else if (contentText.toLowerCase().includes('coding') || contentText.toLowerCase().includes('hacker') || contentText.toLowerCase().includes('tech')) {
      promptTheme = "a minimalist abstract digital matrix with glowing lines of code and technical UI elements";
    }

    const finalPrompt = `An aesthetic generative art piece representing ${promptTheme}, high resolution, 8k, professional lighting, cinematic, vaporwave touches.`;

    res.status(200).json({ 
        prompt: finalPrompt,
        vibeTheme: promptTheme.replace('a ', '').replace('an ', '')
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getNarratorVoice = async (req, res) => {
  try {
    const { style } = req.body;
    const voices = {
        cyberpunk: { name: "Neural-Link 7", effect: "Bitcrush + Echo" },
        lofi: { name: "Vinyl Dreamer", effect: "Lowpass + Crackle" },
        vaporwave: { name: "Marble Statue", effect: "Reverb + Slow" },
        dark_academia: { name: "The Archivist", effect: "Crisp + Monotone" },
        minimalist: { name: "Pure Flow", effect: "Clean + Dry" }
    };
    
    res.status(200).json({ 
        voice: voices[style] || voices.minimalist,
        previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" // Mock
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
