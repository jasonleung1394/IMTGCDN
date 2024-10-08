document.addEventListener('DOMContentLoaded', function() {
    function loadScript(src, callback, isModule = false) {
        var script = document.createElement('script');
        script.type = isModule ? 'module' : 'text/javascript';
        script.src = src;
        script.onload = callback;
        document.head.appendChild(script);
    }

    function loadStylesheet(href) {
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
    }

    // Load all stylesheets
    loadStylesheet('https://cdn.jsdelivr.net/gh/jasonleung1394/IMTGCDN@main/custom.css?id=1');
    loadStylesheet('https://cdn.jsdelivr.net/gh/jasonleung1394/IMTGCDN@main/AddOnChatBotStyle.css?id=3');
    loadStylesheet('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0');
    loadStylesheet('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200');

    // Load jQuery first
    loadScript('https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js', function() {
        // Dynamically import chatbot.js as a module
        import('https://cdn.jsdelivr.net/gh/jasonleung1394/IMTGCDN@main/chatbot.js')
        .then(({ createChat }) => {
            // Initialize the chatbot
            createChat({
                webhookUrl: 'https://primary-production-4c7d.up.railway.app/webhook/78af2942-94b1-44e0-a5c7-adb0acdeb82a/chat',
                i18n: {
                    en: {
                        title: 'AI Assistant',
                        subtitle: '',
                        footer: '',
                        getStarted: 'New Conversation',
                        inputPlaceholder: 'Type your question..',
                    }
                }
            });
        })
        .catch((err) => {
            console.error("Error loading chatbot module:", err);
        });
    });

    // Load additional features script
    loadScript('https://cdn.jsdelivr.net/gh/jasonleung1394/IMTGCDN@main/addOnFeatures.js');
});
