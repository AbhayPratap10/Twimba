import { tweetsData as OrginalTweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

let tweetsData = OrginalTweetsData
const replyPopUpEl = document.getElementById('reply-pop-up')
let replyId = ''

document.addEventListener('click', function(e){
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.replies){
        handleRepliesClick(e.target.dataset.replies)
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }
    else if(e.target.dataset.trash){
        handleDeleteClick(e.target.dataset.trash)
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    }
    else if(e.target.id === 'reply-btn'){
        handleReplyBtnClick()
    }
    else if(!(e.target.closest(".reply-pop-up"))){
        closeReplyPopUp()
    }
})
 
function handleLikeClick(tweetId){ 
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    render()
}

function handleRetweetClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    render() 
}

function handleRepliesClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
}

function handleReplyClick(tweetId){
    replyPopUpEl.style.display = 'flex'
    replyId = tweetId
}

function handleDeleteClick(tweetId){
    tweetsData = tweetsData.filter(tweet => tweet.uuid !== tweetId)
    render()
}


//button functions

function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')

    if(tweetInput.value){
        tweetsData.unshift({
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })
    render()
    tweetInput.value = ''
    }

}

function handleReplyBtnClick(){
    const replyInput = document.getElementById('reply-input')
    
    const targetTweetObj=tweetsData.find(tweet=> tweet.uuid ===replyId)

    if(targetTweetObj && replyInput.value){
        targetTweetObj.replies.unshift({
            handle:'@Scrimba',
            profilePic: 'images/scrimbalogo.png',
            tweetText:replyInput.value
        })
        render()
        closeReplyPopUp()
    }
}



function getFeedHtml(){
    let feedHtml = ``
    
    tweetsData.forEach(function(tweet){
        
        let likeIconClass = ''
        
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
        let retweetIconClass = ''
        
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }

        let repliesHtml = ''
        
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                repliesHtml+=`
<div class="tweet-reply">
    <div class="tweet-inner">
        <img src="${reply.profilePic}" class="profile-pic">
            <div>
                <p class="handle">${reply.handle}</p>
                <p class="tweet-text">${reply.tweetText}</p>
            </div>
        </div>
</div>
`
            })
        }
        
          
        feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-replies="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-reply replyIcon"
                    data-reply ="${tweet.uuid}"
                    ></i>
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-trash-can"
                    data-trash ="${tweet.uuid}"
                ></i>
            </span>
            </div>   
        </div>            
    </div>
    <div class="hidden" id="replies-${tweet.uuid}">
        ${repliesHtml}
    </div>   
</div>
`
   })
   return feedHtml 
}

function closeReplyPopUp(){
    replyPopUpEl.style.display = 'none'    
}

function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()
}

render()

