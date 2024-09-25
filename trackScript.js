let sessionStartTime = new Date();  // Record the session start time
let userId;
let payload;
let interactionData = [];  // Array to store all button click interactions
let userMouseMove = {};
let userScrollDepth = {};

// Function to generate a unique ID
function generateUniqueId() {
    return 'id-' + Math.random().toString(36).substr(2, 16);
}

// Function to set a cookie
function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

// Function to get a cookie by name
function getCookie(name) {
    let nameEQ = name + "=";
    let cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let c = cookies[i].trim();
        if (c.indexOf(nameEQ) === 0) {
            return c.substring(nameEQ.length, c.length);
        }
    }
    return null;
}

function constructPayload(action) {
    // Prepare data to send via sendBeacon
    let sessionEndTime = new Date();  // Record the session end time
    const data = {
        userId: userId,
        action: action,
        timestamp: new Date().toISOString(),
        userDetails: {
            name: 'John Doe',  // Replace with actual user name if available
            email: 'john.doe@example.com'  // Replace with actual user email if available
        },
        browserInfo: {
            userAgent: navigator.userAgent,
            language: navigator.language
        },
        deviceInfo: {
            screenWidth: window.screen.width,
            screenHeight: window.screen.height
        },
        sessionData: {
            pageVisited: window.location.pathname,
            timeSpentOnPage: (sessionEndTime - sessionStartTime) / 1000 + 's',
            pageURL: window.location.href,
            interactionData: interactionData,
            userMouseMove: userMouseMove,
            userScrollDepth: userScrollDepth
        }
    };
    // Send the data to track.php using navigator.sendBeacon
    payload = JSON.stringify(data);
}

// Generate and store user ID when the page loads
window.onload = function () {
    // Get user ID from cookies or generate a new one
    userId = getCookie('userId');
    if (!userId) {
        userId = generateUniqueId();
        setCookie('userId', userId, 365);  // Store for 1 year
        console.log("New userId generated and stored: " + userId);
    } else {
        console.log("Existing userId found: " + userId);
    }
};

// Use sendBeacon for sending data when the user closes the tab or navigates away
window.addEventListener('beforeunload', function (event) {
    constructPayload('session_unload');
    const url = 'https://dev80.imtg.com.au/leadDemo/track.php';
    navigator.sendBeacon(url, new Blob([payload], { type: 'application/json' }));
});

// Track user interaction but do not send immediately
function trackInteraction(action) {
    interactionData.push({
        action: action,
        timestamp: new Date().toISOString()
    });
}

// Event listener to track button clicks
window.addEventListener('click', function (event) {
    if (event.target.tagName === 'BUTTON') {
        trackInteraction('button_clicked?' + event.target.id);
    } else if (event.target.tagName === 'A') {
        console.log('a tag clicked');
    } else {
        console.log('unregistered');
    }
});

// start mouse move
// Array to store mouse positions temporarily
let mousePositions = [];

// Object to store scroll depth over time
let scrollDepthLog = [];

// Event listener for mouse movement
document.addEventListener('mousemove', (event) => {
    // Update mouse position
    const { clientX: x, clientY: y } = event;
    mousePositions.push({ x, y, timestamp: new Date().toISOString() });
});

// Event listener for scroll depth tracking
window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;

    // Calculate scroll depth percentage
    const scrollDepth = (scrollTop / documentHeight) * 100;

    // Log scroll depth with timestamp
    scrollDepthLog.push({ scrollDepth: scrollDepth.toFixed(2), timestamp: new Date().toISOString() });
});

// Function to log mouse positions and scroll depth every 5 seconds
function logMousePositionsAndScrollDepth() {
    const now = new Date().toISOString();

    // Log mouse positions count
    userMouseMove[now] = mousePositions.length;

    // Log scroll depth (take the latest scroll depth at this time)
    if (scrollDepthLog.length > 0) {
        userScrollDepth[now] = scrollDepthLog[scrollDepthLog.length - 1].scrollDepth;
    }

    // Clear the arrays after logging
    mousePositions = [];
    scrollDepthLog = [];
}

// Set an interval to log mouse positions and scroll depth every 5 seconds
setInterval(logMousePositionsAndScrollDepth, 5000);


// Function to reset cookies (for testing purposes)
function resetCookies() {
    deleteCookie('userId');
    alert("Cookies have been reset.");
    window.location.reload();  // Reload the page to apply changes
}

function deleteCookie(name) {
    document.cookie = name + '=; Max-Age=-99999999; path=/';
}
