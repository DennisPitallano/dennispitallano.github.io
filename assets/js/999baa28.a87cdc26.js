"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[245],{3905:function(e,a,t){t.d(a,{Zo:function(){return u},kt:function(){return k}});var n=t(7294);function r(e,a,t){return a in e?Object.defineProperty(e,a,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[a]=t,e}function l(e,a){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);a&&(n=n.filter((function(a){return Object.getOwnPropertyDescriptor(e,a).enumerable}))),t.push.apply(t,n)}return t}function o(e){for(var a=1;a<arguments.length;a++){var t=null!=arguments[a]?arguments[a]:{};a%2?l(Object(t),!0).forEach((function(a){r(e,a,t[a])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):l(Object(t)).forEach((function(a){Object.defineProperty(e,a,Object.getOwnPropertyDescriptor(t,a))}))}return e}function s(e,a){if(null==e)return{};var t,n,r=function(e,a){if(null==e)return{};var t,n,r={},l=Object.keys(e);for(n=0;n<l.length;n++)t=l[n],a.indexOf(t)>=0||(r[t]=e[t]);return r}(e,a);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(n=0;n<l.length;n++)t=l[n],a.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(r[t]=e[t])}return r}var i=n.createContext({}),c=function(e){var a=n.useContext(i),t=a;return e&&(t="function"==typeof e?e(a):o(o({},a),e)),t},u=function(e){var a=c(e.components);return n.createElement(i.Provider,{value:a},e.children)},d={inlineCode:"code",wrapper:function(e){var a=e.children;return n.createElement(n.Fragment,{},a)}},m=n.forwardRef((function(e,a){var t=e.components,r=e.mdxType,l=e.originalType,i=e.parentName,u=s(e,["components","mdxType","originalType","parentName"]),m=c(t),k=r,b=m["".concat(i,".").concat(k)]||m[k]||d[k]||l;return t?n.createElement(b,o(o({ref:a},u),{},{components:t})):n.createElement(b,o({ref:a},u))}));function k(e,a){var t=arguments,r=a&&a.mdxType;if("string"==typeof e||r){var l=t.length,o=new Array(l);o[0]=m;var s={};for(var i in a)hasOwnProperty.call(a,i)&&(s[i]=a[i]);s.originalType=e,s.mdxType="string"==typeof e?e:r,o[1]=s;for(var c=2;c<l;c++)o[c]=t[c];return n.createElement.apply(null,o)}return n.createElement.apply(null,t)}m.displayName="MDXCreateElement"},8215:function(e,a,t){t.d(a,{Z:function(){return r}});var n=t(7294);function r(e){var a=e.children,t=e.hidden,r=e.className;return n.createElement("div",{role:"tabpanel",hidden:t,className:r},a)}},9877:function(e,a,t){t.d(a,{Z:function(){return u}});var n=t(7462),r=t(7294),l=t(2389),o=t(3725),s=t(6010),i="tabItem_LplD";function c(e){var a,t,l,c=e.lazy,u=e.block,d=e.defaultValue,m=e.values,k=e.groupId,b=e.className,p=r.Children.map(e.children,(function(e){if((0,r.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),v=null!=m?m:p.map((function(e){var a=e.props;return{value:a.value,label:a.label,attributes:a.attributes}})),y=(0,o.lx)(v,(function(e,a){return e.value===a.value}));if(y.length>0)throw new Error('Docusaurus error: Duplicate values "'+y.map((function(e){return e.value})).join(", ")+'" found in <Tabs>. Every value needs to be unique.');var w=null===d?d:null!=(a=null!=d?d:null==(t=p.find((function(e){return e.props.default})))?void 0:t.props.value)?a:null==(l=p[0])?void 0:l.props.value;if(null!==w&&!v.some((function(e){return e.value===w})))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+w+'" but none of its children has the corresponding value. Available values are: '+v.map((function(e){return e.value})).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");var h=(0,o.UB)(),f=h.tabGroupChoices,g=h.setTabGroupChoices,T=(0,r.useState)(w),B=T[0],R=T[1],S=[],N=(0,o.o5)().blockElementScrollPositionUntilNextRender;if(null!=k){var D=f[k];null!=D&&D!==B&&v.some((function(e){return e.value===D}))&&R(D)}var x=function(e){var a=e.currentTarget,t=S.indexOf(a),n=v[t].value;n!==B&&(N(a),R(n),null!=k&&g(k,n))},C=function(e){var a,t=null;switch(e.key){case"ArrowRight":var n=S.indexOf(e.currentTarget)+1;t=S[n]||S[0];break;case"ArrowLeft":var r=S.indexOf(e.currentTarget)-1;t=S[r]||S[S.length-1]}null==(a=t)||a.focus()};return r.createElement("div",{className:"tabs-container"},r.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,s.Z)("tabs",{"tabs--block":u},b)},v.map((function(e){var a=e.value,t=e.label,l=e.attributes;return r.createElement("li",(0,n.Z)({role:"tab",tabIndex:B===a?0:-1,"aria-selected":B===a,key:a,ref:function(e){return S.push(e)},onKeyDown:C,onFocus:x,onClick:x},l,{className:(0,s.Z)("tabs__item",i,null==l?void 0:l.className,{"tabs__item--active":B===a})}),null!=t?t:a)}))),c?(0,r.cloneElement)(p.filter((function(e){return e.props.value===B}))[0],{className:"margin-vert--md"}):r.createElement("div",{className:"margin-vert--md"},p.map((function(e,a){return(0,r.cloneElement)(e,{key:a,hidden:e.props.value!==B})}))))}function u(e){var a=(0,l.Z)();return r.createElement(c,(0,n.Z)({key:String(a)},e))}},2790:function(e,a,t){t.r(a),t.d(a,{frontMatter:function(){return c},contentTitle:function(){return u},metadata:function(){return d},assets:function(){return m},toc:function(){return k},default:function(){return p}});var n=t(7462),r=t(3366),l=(t(7294),t(3905)),o=t(9877),s=t(8215),i=["components"],c={sidebar_position:5},u="\ud83c\udfafBlocks API Endpoints",d={unversionedId:"bscsan-netcore/blocks-api",id:"bscsan-netcore/blocks-api",title:"\ud83c\udfafBlocks API Endpoints",description:"Endpoints with \ud83c\udd7f\ud83c\udd81\ud83c\udd7e are under the API Pro subscription. To upgrade your API plan, browse through the BscScan APIs page.",source:"@site/docs/bscsan-netcore/blocks-api.mdx",sourceDirName:"bscsan-netcore",slug:"/bscsan-netcore/blocks-api",permalink:"/docs/bscsan-netcore/blocks-api",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/bscsan-netcore/blocks-api.mdx",tags:[],version:"current",sidebarPosition:5,frontMatter:{sidebar_position:5},sidebar:"tutorialSidebar",previous:{title:"\ud83c\udfafTransaction API Endpoints",permalink:"/docs/bscsan-netcore/transaction-api"},next:{title:"\ud83c\udfafGeth Proxy API Endpoints",permalink:"/docs/bscsan-netcore/geth-proxy-api"}},m={},k=[{value:"\ud83d\udce6Get Block Rewards by BlockNo",id:"get-block-rewards-by-blockno",level:3},{value:"Returns the block reward awarded for validating a certain block.",id:"returns-the-block-reward-awarded-for-validating-a-certain-block",level:4},{value:"\ud83d\udce6Get Estimated Block Countdown Time by BlockNo",id:"get-estimated-block-countdown-time-by-blockno",level:3},{value:"Returns the estimated time remaining, in seconds, until a certain block is validated.",id:"returns-the-estimated-time-remaining-in-seconds-until-a-certain-block-is-validated",level:4},{value:"\ud83d\udce6Get Block Number by Timestamp",id:"get-block-number-by-timestamp",level:3},{value:"Returns the block number that was validated at a certain timestamp.",id:"returns-the-block-number-that-was-validated-at-a-certain-timestamp",level:4},{value:"\ud83d\udce6Get Daily Average Block Size <code>\ud83c\udd7f\ud83c\udd81\ud83c\udd7e</code>",id:"get-daily-average-block-size-\ud83c\udd7f\ud83c\udd81\ud83c\udd7e",level:3},{value:"Returns the daily average block size within a date range.",id:"returns-the-daily-average-block-size-within-a-date-range",level:4},{value:"\ud83d\udce6Get Daily Block Count and Rewards <code>\ud83c\udd7f\ud83c\udd81\ud83c\udd7e</code>",id:"get-daily-block-count-and-rewards-\ud83c\udd7f\ud83c\udd81\ud83c\udd7e",level:3},{value:"Returns the number of blocks validated daily and the amount of block rewards.",id:"returns-the-number-of-blocks-validated-daily-and-the-amount-of-block-rewards",level:4},{value:"\ud83d\udce6Get Daily Block Rewards <code>\ud83c\udd7f\ud83c\udd81\ud83c\udd7e</code>",id:"get-daily-block-rewards-\ud83c\udd7f\ud83c\udd81\ud83c\udd7e",level:3},{value:"Returns the amount of block rewards distributed to validators daily.",id:"returns-the-amount-of-block-rewards-distributed-to-validators-daily",level:4},{value:"\ud83d\udce6Get Daily Average Time for A Block to be Included in the BNB Smart Chain <code>\ud83c\udd7f\ud83c\udd81\ud83c\udd7e</code>",id:"get-daily-average-time-for-a-block-to-be-included-in-the-bnb-smart-chain-\ud83c\udd7f\ud83c\udd81\ud83c\udd7e",level:3},{value:"Returns the daily average of time needed for a block to be successfully validated.",id:"returns-the-daily-average-of-time-needed-for-a-block-to-be-successfully-validated",level:4}],b={toc:k};function p(e){var a=e.components,t=(0,r.Z)(e,i);return(0,l.kt)("wrapper",(0,n.Z)({},b,t,{components:a,mdxType:"MDXLayout"}),(0,l.kt)("h1",{id:"blocks-api-endpoints"},"\ud83c\udfafBlocks API Endpoints"),(0,l.kt)("div",{className:"admonition admonition-success alert alert--success"},(0,l.kt)("div",{parentName:"div",className:"admonition-heading"},(0,l.kt)("h5",{parentName:"div"},(0,l.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,l.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"12",height:"16",viewBox:"0 0 12 16"},(0,l.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.5 0C3.48 0 1 2.19 1 5c0 .92.55 2.25 1 3 1.34 2.25 1.78 2.78 2 4v1h5v-1c.22-1.22.66-1.75 2-4 .45-.75 1-2.08 1-3 0-2.81-2.48-5-5.5-5zm3.64 7.48c-.25.44-.47.8-.67 1.11-.86 1.41-1.25 2.06-1.45 3.23-.02.05-.02.11-.02.17H5c0-.06 0-.13-.02-.17-.2-1.17-.59-1.83-1.45-3.23-.2-.31-.42-.67-.67-1.11C2.44 6.78 2 5.65 2 5c0-2.2 2.02-4 4.5-4 1.22 0 2.36.42 3.22 1.19C10.55 2.94 11 3.94 11 5c0 .66-.44 1.78-.86 2.48zM4 14h5c-.23 1.14-1.3 2-2.5 2s-2.27-.86-2.5-2z"}))),"Notes")),(0,l.kt)("div",{parentName:"div",className:"admonition-content"},(0,l.kt)("p",{parentName:"div"},"Endpoints with ",(0,l.kt)("inlineCode",{parentName:"p"},"\ud83c\udd7f\ud83c\udd81\ud83c\udd7e")," are under the API Pro subscription. To upgrade your API plan, browse through the ",(0,l.kt)("a",{parentName:"p",href:"https://bscscan.com/s_checkout"},"BscScan APIs")," page."))),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-jsx"},"//imports\nusing BscScan.NetCore.Contracts;\n\n//inject\nprivate readonly IBscScanBlocksService _bscScanBlocksService;\n")),(0,l.kt)("h3",{id:"get-block-rewards-by-blockno"},"\ud83d\udce6Get Block Rewards by BlockNo"),(0,l.kt)("h4",{id:"returns-the-block-reward-awarded-for-validating-a-certain-block"},"Returns the block reward awarded for validating a certain block."),(0,l.kt)(o.Z,{mdxType:"Tabs"},(0,l.kt)(s.Z,{value:"request",label:"Request",default:!0,mdxType:"TabItem"},(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-jsx"},'//Sample Request \ud83c\udf4e\n\n var blockRewards =\n                await _bscScanBlocksService.GetBlockRewardsByBlockNoAsync("2170000");\n'))),(0,l.kt)(s.Z,{value:"response",label:"Response",mdxType:"TabItem"},(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-js"},'//will return a new object BlockRewards with values: \ud83c\udf4a\nvar blockRewards = new BlockRewards {\n     Staus="1",\n     Message="OK",\n     Result= new BlockRewardData{\n         BlockNumber = "2170000",\n         TimeStamp ="1605182836",\n         BlockMiner ="0x68bf0b8b6fb4e317a0f9d6f03eaf8ce6675bc60d",\n         BlockReward ="13657915000000000",\n         Uncles = null, // List<string> \n         UncleInclusionReward = "0"\n     }\n};\n'))),(0,l.kt)(s.Z,{value:"...",label:"...",mdxType:"TabItem"},"\ud83c\udf4c For more information Check out",(0,l.kt)("a",{target:"_blank",href:"https://docs.bscscan.com/api-endpoints/blocks#get-block-rewards-by-blockno"}," Get Block Rewards by BlockNo"))),(0,l.kt)("h3",{id:"get-estimated-block-countdown-time-by-blockno"},"\ud83d\udce6Get Estimated Block Countdown Time by BlockNo"),(0,l.kt)("h4",{id:"returns-the-estimated-time-remaining-in-seconds-until-a-certain-block-is-validated"},"Returns the estimated time remaining, in seconds, until a certain block is validated."),(0,l.kt)(o.Z,{mdxType:"Tabs"},(0,l.kt)(s.Z,{value:"request",label:"Request",default:!0,mdxType:"TabItem"},(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-jsx"},'//Sample Request \ud83c\udf4e\n\n var estimatedBlockCountdownTime =\n                await _bscScanBlocksService.GetEstimatedBlockCountdownTimeByBlockNoAsync("119268990");\n'))),(0,l.kt)(s.Z,{value:"response",label:"Response",mdxType:"TabItem"},(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-js"},'//will return a new object EstimatedBlockCountdownTime with values: \ud83c\udf4a\nvar estimatedBlockCountdownTime = new EstimatedBlockCountdownTime {\n     Staus="1",\n     Message="OK",\n     Result= new EstimatedBlockCountdownTimeData{\n         CurrentBlock = "15911100",\n         CountdownBlock ="119268990",\n         RemainingBlock ="103357890",\n         EstimateTimeInSec ="10073685.0"\n     }\n};\n'))),(0,l.kt)(s.Z,{value:"...",label:"...",mdxType:"TabItem"},"\ud83c\udf4c For more information Check out",(0,l.kt)("a",{target:"_blank",href:"https://docs.bscscan.com/api-endpoints/blocks#get-estimated-block-countdown-time-by-blockno"}," Get Estimated Block Countdown Time by BlockNo"))),(0,l.kt)("h3",{id:"get-block-number-by-timestamp"},"\ud83d\udce6Get Block Number by Timestamp"),(0,l.kt)("h4",{id:"returns-the-block-number-that-was-validated-at-a-certain-timestamp"},"Returns the block number that was validated at a certain timestamp."),(0,l.kt)(o.Z,{mdxType:"Tabs"},(0,l.kt)(s.Z,{value:"request",label:"Request",default:!0,mdxType:"TabItem"},(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-jsx"},"//Sample Request \ud83c\udf4e\n\n var blockNumber =\n            await _bscScanBlocksService.GetBlockNumberByTimestampAsync(1601510400);\n"))),(0,l.kt)(s.Z,{value:"response",label:"Response",mdxType:"TabItem"},(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-js"},'//will return a new object BlockNumber with values: \ud83c\udf4a\nvar blockNumber = new BlockNumber {\n     Staus="1",\n     Message="OK",\n     Result= "946206"\n};\n'))),(0,l.kt)(s.Z,{value:"...",label:"...",mdxType:"TabItem"},"\ud83c\udf4c For more information Check out",(0,l.kt)("a",{target:"_blank",href:"https://docs.bscscan.com/api-endpoints/blocks#get-block-number-by-timestamp"}," Get Block Number by Timestamp"))),(0,l.kt)("h3",{id:"get-daily-average-block-size-\ud83c\udd7f\ud83c\udd81\ud83c\udd7e"},"\ud83d\udce6Get Daily Average Block Size ",(0,l.kt)("inlineCode",{parentName:"h3"},"\ud83c\udd7f\ud83c\udd81\ud83c\udd7e")),(0,l.kt)("h4",{id:"returns-the-daily-average-block-size-within-a-date-range"},"Returns the daily average block size within a date range."),(0,l.kt)(o.Z,{mdxType:"Tabs"},(0,l.kt)(s.Z,{value:"request",label:"Request",default:!0,mdxType:"TabItem"},(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-jsx"},"//Sample Request \ud83c\udf4e\n\nvar parameters = new DailyAverageBlockSizeRequest\n            {\n                StartDate = new DateOnly(2021,8,1),\n                EndDate = new DateOnly(2021,8,31),\n                Sort = Sort.Asc\n            };\nvar avgBlockSize =\n            await _bscScanBlocksService.GetDailyAverageBlockSizeAsync(parameters);\n"))),(0,l.kt)(s.Z,{value:"response",label:"Response",mdxType:"TabItem"},(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-js"},'//will return a new object DailyAverageBlockSize with values: \ud83c\udf4a\nvar avgBlockSize = new DailyAverageBlockSize {\n     Staus="1",\n     Message="OK",\n     Result= new List<DailyAverageBlockSizeData>\n        {\n            new()\n            {\n                UTCDate = "2021-08-01",\n                UnixTimeStamp = "1627776000",\n                BlockSizeBytes = 96364\n            },\n            new()\n            {\n                UTCDate = "2021-08-02",\n                UnixTimeStamp = "1627862400",\n                BlockSizeBytes = 94832\n            },\n            new()\n            {\n                UTCDate = "2021-08-31",\n                UnixTimeStamp = "1630368000",\n                BlockSizeBytes = 90159\n            }\n        }\n};\n'))),(0,l.kt)(s.Z,{value:"...",label:"...",mdxType:"TabItem"},"\ud83c\udf4c For more information Check out",(0,l.kt)("a",{target:"_blank",href:"https://docs.bscscan.com/api-endpoints/blocks#get-daily-average-block-size"}," Get Daily Average Block Size `\ud83c\udd7f\ud83c\udd81\ud83c\udd7e`"))),(0,l.kt)("h3",{id:"get-daily-block-count-and-rewards-\ud83c\udd7f\ud83c\udd81\ud83c\udd7e"},"\ud83d\udce6Get Daily Block Count and Rewards ",(0,l.kt)("inlineCode",{parentName:"h3"},"\ud83c\udd7f\ud83c\udd81\ud83c\udd7e")),(0,l.kt)("h4",{id:"returns-the-number-of-blocks-validated-daily-and-the-amount-of-block-rewards"},"Returns the number of blocks validated daily and the amount of block rewards."),(0,l.kt)(o.Z,{mdxType:"Tabs"},(0,l.kt)(s.Z,{value:"request",label:"Request",default:!0,mdxType:"TabItem"},(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-jsx"},"//Sample Request \ud83c\udf4e\n\nvar parameters = new DailyBlockCountAndRewardRequest\n            {\n                StartDate = new DateOnly(2021,8,1),\n                EndDate = new DateOnly(2021,8,31),\n                Sort = Sort.Asc\n            };\nvar dailyBlockCountAndRewards =\n                await _bscScanBlocksService.GetDailyBlockCountsAndRewardsAsync(parameters);\n"))),(0,l.kt)(s.Z,{value:"response",label:"Response",mdxType:"TabItem"},(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-js"},'//will return a new object DailyBlockCountAndRewards with values: \ud83c\udf4a\nvar dailyBlockCountAndRewards = new DailyBlockCountAndRewards {\n     Staus="1",\n     Message="OK",\n     Result= new List<DailyBlockCountAndRewardsData>\n        {\n            new()\n            {\n                UTCDate = "2021-08-01",\n                UnixTimeStamp = "1627776000",\n                BlockCount = 27783,\n                BlockRewardsEth = "9216.309553593894910979"\n            },\n            new()\n            {\n                UTCDate = "2021-08-02",\n                UnixTimeStamp = "1627862400",\n                BlockCount = 27941,\n                BlockRewardsEth = "8474.944904178535758101"\n            },\n            new()\n            {\n                UTCDate = "2021-08-31",\n                UnixTimeStamp = "1630368000",\n                BlockCount = 28357,\n                BlockRewardsEth = "7213.736543000372715456"\n            }\n        }\n};\n'))),(0,l.kt)(s.Z,{value:"...",label:"...",mdxType:"TabItem"},"\ud83c\udf4c For more information Check out",(0,l.kt)("a",{target:"_blank",href:"https://docs.bscscan.com/api-endpoints/blocks#get-daily-block-count-and-rewards"}," Get Daily Block Count and Rewards `\ud83c\udd7f\ud83c\udd81\ud83c\udd7e`"))),(0,l.kt)("h3",{id:"get-daily-block-rewards-\ud83c\udd7f\ud83c\udd81\ud83c\udd7e"},"\ud83d\udce6Get Daily Block Rewards ",(0,l.kt)("inlineCode",{parentName:"h3"},"\ud83c\udd7f\ud83c\udd81\ud83c\udd7e")),(0,l.kt)("h4",{id:"returns-the-amount-of-block-rewards-distributed-to-validators-daily"},"Returns the amount of block rewards distributed to validators daily."),(0,l.kt)(o.Z,{mdxType:"Tabs"},(0,l.kt)(s.Z,{value:"request",label:"Request",default:!0,mdxType:"TabItem"},(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-jsx"},"//Sample Request \ud83c\udf4e\n\n var parameters = new DailyBlockRequest\n            {\n                StartDate = new DateOnly(2021,8,1),\n                EndDate = new DateOnly(2021,8,31),\n                Sort = Sort.Asc\n            };\nvar dailyBlockRewards =\n                await _bscScanBlocksService.GetDailyBlockRewardsAsync(parameters);\n"))),(0,l.kt)(s.Z,{value:"response",label:"Response",mdxType:"TabItem"},(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-js"},'//will return a new object DailyBlockRewards with values: \ud83c\udf4a\nvar dailyBlockRewards = new DailyBlockRewards {\n     Staus="1",\n     Message="OK",\n     Result= new List<DailyBlockRewardsData>\n        {\n            new()\n            {\n                UTCDate = "2021-08-01",\n                UnixTimeStamp = "1627776000",\n                BlockRewardsEth = "9216.309553593894910979"\n            },\n            new()\n            {\n                UTCDate = "2021-08-02",\n                UnixTimeStamp = "1627862400",\n                BlockRewardsEth = "8474.944904178535758101"\n            },\n            new()\n            {\n                UTCDate = "2021-08-31",\n                UnixTimeStamp = "1630368000",\n                BlockRewardsEth = "7213.736543000372715456"\n            }\n        }\n};\n'))),(0,l.kt)(s.Z,{value:"...",label:"...",mdxType:"TabItem"},"\ud83c\udf4c For more information Check out",(0,l.kt)("a",{target:"_blank",href:"https://docs.bscscan.com/api-endpoints/blocks#get-daily-block-rewards"}," Get Daily Block Rewards `\ud83c\udd7f\ud83c\udd81\ud83c\udd7e`"))),(0,l.kt)("h3",{id:"get-daily-average-time-for-a-block-to-be-included-in-the-bnb-smart-chain-\ud83c\udd7f\ud83c\udd81\ud83c\udd7e"},"\ud83d\udce6Get Daily Average Time for A Block to be Included in the BNB Smart Chain ",(0,l.kt)("inlineCode",{parentName:"h3"},"\ud83c\udd7f\ud83c\udd81\ud83c\udd7e")),(0,l.kt)("h4",{id:"returns-the-daily-average-of-time-needed-for-a-block-to-be-successfully-validated"},"Returns the daily average of time needed for a block to be successfully validated."),(0,l.kt)(o.Z,{mdxType:"Tabs"},(0,l.kt)(s.Z,{value:"request",label:"Request",default:!0,mdxType:"TabItem"},(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-jsx"},"//Sample Request \ud83c\udf4e\n\nvar parameters = new DailyBlockRequest\n            {\n                StartDate = new DateOnly(2021,8,1),\n                EndDate = new DateOnly(2021,8,31),\n                Sort = Sort.Asc\n            };\nvar dailyAvgBlockRewards =\n                await _bscScanBlocksService.GetDailyAverageTimeForABlockAsync(parameters);\n"))),(0,l.kt)(s.Z,{value:"response",label:"Response",mdxType:"TabItem"},(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-js"},'//will return a new object DailyAverageTimeForBlock with values: \ud83c\udf4a\nvar dailyAvgBlockRewards = new DailyAverageTimeForBlock {\n     Staus="1",\n     Message="OK",\n     Result= new List<DailyAverageTimeForBlockData>\n        {\n            new()\n            {\n                UTCDate = "2021-08-01",\n                UnixTimeStamp = "1627776000",\n                BlockTimeSec = "3.11"\n            },\n            new()\n            {\n                UTCDate = "2021-08-02",\n                UnixTimeStamp = "1627862400",\n                BlockTimeSec = "3.09"\n            },\n            new()\n            {\n                UTCDate = "2021-08-31",\n                UnixTimeStamp = "1630368000",\n                BlockTimeSec = "3.05"\n            }\n        }\n};\n'))),(0,l.kt)(s.Z,{value:"...",label:"...",mdxType:"TabItem"},"\ud83c\udf4c For more information Check out",(0,l.kt)("a",{target:"_blank",href:"https://docs.bscscan.com/api-endpoints/blocks#get-daily-average-time-for-a-block-to-be-included-in-the-bnb-smart-chain"}," Get Daily Average Time for A Block to be Included in the BNB Smart Chain `\ud83c\udd7f\ud83c\udd81\ud83c\udd7e`"))))}p.isMDXComponent=!0}}]);