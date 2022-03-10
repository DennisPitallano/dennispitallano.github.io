"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[858],{3905:function(e,t,n){n.d(t,{Zo:function(){return u},kt:function(){return k}});var a=n(7294);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function s(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?r(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function c(e,t){if(null==e)return{};var n,a,o=function(e,t){if(null==e)return{};var n,a,o={},r=Object.keys(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var l=a.createContext({}),i=function(e){var t=a.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):s(s({},t),e)),n},u=function(e){var t=i(e.components);return a.createElement(l.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},p=a.forwardRef((function(e,t){var n=e.components,o=e.mdxType,r=e.originalType,l=e.parentName,u=c(e,["components","mdxType","originalType","parentName"]),p=i(n),k=o,b=p["".concat(l,".").concat(k)]||p[k]||d[k]||r;return n?a.createElement(b,s(s({ref:t},u),{},{components:n})):a.createElement(b,s({ref:t},u))}));function k(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var r=n.length,s=new Array(r);s[0]=p;var c={};for(var l in t)hasOwnProperty.call(t,l)&&(c[l]=t[l]);c.originalType=e,c.mdxType="string"==typeof e?e:o,s[1]=c;for(var i=2;i<r;i++)s[i]=n[i];return a.createElement.apply(null,s)}return a.createElement.apply(null,n)}p.displayName="MDXCreateElement"},8215:function(e,t,n){n.d(t,{Z:function(){return o}});var a=n(7294);function o(e){var t=e.children,n=e.hidden,o=e.className;return a.createElement("div",{role:"tabpanel",hidden:n,className:o},t)}},9877:function(e,t,n){n.d(t,{Z:function(){return u}});var a=n(7462),o=n(7294),r=n(2389),s=n(3725),c=n(6010),l="tabItem_LplD";function i(e){var t,n,r,i=e.lazy,u=e.block,d=e.defaultValue,p=e.values,k=e.groupId,b=e.className,m=o.Children.map(e.children,(function(e){if((0,o.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),f=null!=p?p:m.map((function(e){var t=e.props;return{value:t.value,label:t.label,attributes:t.attributes}})),h=(0,s.lx)(f,(function(e,t){return e.value===t.value}));if(h.length>0)throw new Error('Docusaurus error: Duplicate values "'+h.map((function(e){return e.value})).join(", ")+'" found in <Tabs>. Every value needs to be unique.');var y=null===d?d:null!=(t=null!=d?d:null==(n=m.find((function(e){return e.props.default})))?void 0:n.props.value)?t:null==(r=m[0])?void 0:r.props.value;if(null!==y&&!f.some((function(e){return e.value===y})))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+y+'" but none of its children has the corresponding value. Available values are: '+f.map((function(e){return e.value})).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");var T=(0,s.UB)(),v=T.tabGroupChoices,g=T.setTabGroupChoices,w=(0,o.useState)(y),B=w[0],A=w[1],S=[],C=(0,s.o5)().blockElementScrollPositionUntilNextRender;if(null!=k){var N=v[k];null!=N&&N!==B&&f.some((function(e){return e.value===N}))&&A(N)}var x=function(e){var t=e.currentTarget,n=S.indexOf(t),a=f[n].value;a!==B&&(C(t),A(a),null!=k&&g(k,a))},P=function(e){var t,n=null;switch(e.key){case"ArrowRight":var a=S.indexOf(e.currentTarget)+1;n=S[a]||S[0];break;case"ArrowLeft":var o=S.indexOf(e.currentTarget)-1;n=S[o]||S[S.length-1]}null==(t=n)||t.focus()};return o.createElement("div",{className:"tabs-container"},o.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,c.Z)("tabs",{"tabs--block":u},b)},f.map((function(e){var t=e.value,n=e.label,r=e.attributes;return o.createElement("li",(0,a.Z)({role:"tab",tabIndex:B===t?0:-1,"aria-selected":B===t,key:t,ref:function(e){return S.push(e)},onKeyDown:P,onFocus:x,onClick:x},r,{className:(0,c.Z)("tabs__item",l,null==r?void 0:r.className,{"tabs__item--active":B===t})}),null!=n?n:t)}))),i?(0,o.cloneElement)(m.filter((function(e){return e.props.value===B}))[0],{className:"margin-vert--md"}):o.createElement("div",{className:"margin-vert--md"},m.map((function(e,t){return(0,o.cloneElement)(e,{key:t,hidden:e.props.value!==B})}))))}function u(e){var t=(0,r.Z)();return o.createElement(i,(0,a.Z)({key:String(t)},e))}},653:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return i},contentTitle:function(){return u},metadata:function(){return d},assets:function(){return p},toc:function(){return k},default:function(){return m}});var a=n(7462),o=n(3366),r=(n(7294),n(3905)),s=n(9877),c=n(8215),l=["components"],i={sidebar_position:7},u="\ud83c\udfafTokens API Endpoints",d={unversionedId:"bscsan-netcore/tokens-api",id:"bscsan-netcore/tokens-api",title:"\ud83c\udfafTokens API Endpoints",description:"Endpoints with \ud83c\udd7f\ud83c\udd81\ud83c\udd7e are under the API Pro subscription. To upgrade your API plan, browse through the BscScan APIs page.",source:"@site/docs/bscsan-netcore/tokens-api.mdx",sourceDirName:"bscsan-netcore",slug:"/bscsan-netcore/tokens-api",permalink:"/docs/bscsan-netcore/tokens-api",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/bscsan-netcore/tokens-api.mdx",tags:[],version:"current",sidebarPosition:7,frontMatter:{sidebar_position:7},sidebar:"tutorialSidebar",previous:{title:"\ud83c\udfafGeth Proxy API Endpoints",permalink:"/docs/bscsan-netcore/geth-proxy-api"},next:{title:"\ud83c\udfafGas Tracker API Endpoints",permalink:"/docs/bscsan-netcore/gas-tracker-api"}},p={},k=[{value:"\ud83d\udcb0Get BEP-20 Token TotalSupply by ContractAddress",id:"get-bep-20-token-totalsupply-by-contractaddress",level:3},{value:"Returns the total supply of a BEP-20 token.",id:"returns-the-total-supply-of-a-bep-20-token",level:4},{value:"\ud83d\udcb0Get BEP-20 Token CirculatingSupply by ContractAddress",id:"get-bep-20-token-circulatingsupply-by-contractaddress",level:3},{value:"Returns the current circulating supply of a BEP-20 token.",id:"returns-the-current-circulating-supply-of-a-bep-20-token",level:4},{value:"\ud83d\udcb0Get BEP-20 Token Account Balance by ContractAddress",id:"get-bep-20-token-account-balance-by-contractaddress",level:3},{value:"Returns the current balance of a BEP-20 token of an address.",id:"returns-the-current-balance-of-a-bep-20-token-of-an-address",level:4},{value:"\ud83d\udcb0Get Token Holder List by Contract Address<code>\ud83c\udd7f\ud83c\udd81\ud83c\udd7e</code>",id:"get-token-holder-list-by-contract-address\ud83c\udd7f\ud83c\udd81\ud83c\udd7e",level:3},{value:"Return the current token holders and number of tokens held.",id:"return-the-current-token-holders-and-number-of-tokens-held",level:4},{value:"\ud83d\udcb0Get Historical BEP-20 Token TotalSupply by ContractAddress &amp; BlockNo<code>\ud83c\udd7f\ud83c\udd81\ud83c\udd7e</code>",id:"get-historical-bep-20-token-totalsupply-by-contractaddress--blockno\ud83c\udd7f\ud83c\udd81\ud83c\udd7e",level:3},{value:"Returns the historical amount of a BEP-20 token in circulation at a certain block height.",id:"returns-the-historical-amount-of-a-bep-20-token-in-circulation-at-a-certain-block-height",level:4},{value:"\ud83d\udcb0Get Historical BEP-20 Token Account Balance by ContractAddress &amp; BlockNo<code>\ud83c\udd7f\ud83c\udd81\ud83c\udd7e</code>",id:"get-historical-bep-20-token-account-balance-by-contractaddress--blockno\ud83c\udd7f\ud83c\udd81\ud83c\udd7e",level:3},{value:"Returns the balance of a BEP-20 token of an address at a certain block height.",id:"returns-the-balance-of-a-bep-20-token-of-an-address-at-a-certain-block-height",level:4},{value:"\ud83d\udcb0Get Token Info by ContractAddress<code>\ud83c\udd7f\ud83c\udd81\ud83c\udd7e</code>",id:"get-token-info-by-contractaddress\ud83c\udd7f\ud83c\udd81\ud83c\udd7e",level:3},{value:"Returns project information and social media links of a BEP-20/BEP-721 token.",id:"returns-project-information-and-social-media-links-of-a-bep-20bep-721-token",level:4}],b={toc:k};function m(e){var t=e.components,n=(0,o.Z)(e,l);return(0,r.kt)("wrapper",(0,a.Z)({},b,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"tokens-api-endpoints"},"\ud83c\udfafTokens API Endpoints"),(0,r.kt)("div",{className:"admonition admonition-success alert alert--success"},(0,r.kt)("div",{parentName:"div",className:"admonition-heading"},(0,r.kt)("h5",{parentName:"div"},(0,r.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,r.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"12",height:"16",viewBox:"0 0 12 16"},(0,r.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.5 0C3.48 0 1 2.19 1 5c0 .92.55 2.25 1 3 1.34 2.25 1.78 2.78 2 4v1h5v-1c.22-1.22.66-1.75 2-4 .45-.75 1-2.08 1-3 0-2.81-2.48-5-5.5-5zm3.64 7.48c-.25.44-.47.8-.67 1.11-.86 1.41-1.25 2.06-1.45 3.23-.02.05-.02.11-.02.17H5c0-.06 0-.13-.02-.17-.2-1.17-.59-1.83-1.45-3.23-.2-.31-.42-.67-.67-1.11C2.44 6.78 2 5.65 2 5c0-2.2 2.02-4 4.5-4 1.22 0 2.36.42 3.22 1.19C10.55 2.94 11 3.94 11 5c0 .66-.44 1.78-.86 2.48zM4 14h5c-.23 1.14-1.3 2-2.5 2s-2.27-.86-2.5-2z"}))),"Notes")),(0,r.kt)("div",{parentName:"div",className:"admonition-content"},(0,r.kt)("p",{parentName:"div"},"Endpoints with ",(0,r.kt)("inlineCode",{parentName:"p"},"\ud83c\udd7f\ud83c\udd81\ud83c\udd7e")," are under the API Pro subscription. To upgrade your API plan, browse through the ",(0,r.kt)("a",{parentName:"p",href:"https://bscscan.com/s_checkout"},"BscScan APIs")," page."))),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-jsx"},"//imports\nusing BscScan.NetCore.Contracts;\n\n//inject\nprivate readonly IBscScanTokensService _bscScanTokensService;\n")),(0,r.kt)("h3",{id:"get-bep-20-token-totalsupply-by-contractaddress"},"\ud83d\udcb0Get BEP-20 Token TotalSupply by ContractAddress"),(0,r.kt)("h4",{id:"returns-the-total-supply-of-a-bep-20-token"},"Returns the total supply of a BEP-20 token."),(0,r.kt)(s.Z,{mdxType:"Tabs"},(0,r.kt)(c.Z,{value:"request",label:"Request",default:!0,mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-jsx"},'//Sample Request \ud83c\udf4e\n var bep20TokenTotalSupply =\n                await _bscScanTokensService.GetBep20TokenTotalSupplyByContractAddressAsync("0xe9e7cea3dedca5984780bafc599bd69add087d56");\n\n'))),(0,r.kt)(c.Z,{value:"response",label:"Response",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},'//will return a new object TokenTotalSupply with values: \ud83c\udf4a\nvar bep20TokenTotalSupply = new TokenTotalSupply\n    {   \n        Status="1",\n        Message="Ok",\n        Result= "4850999388629409465655005527"\n    };\n'))),(0,r.kt)(c.Z,{value:"...",label:"...",mdxType:"TabItem"},"\ud83c\udf4c For more information Check out",(0,r.kt)("a",{target:"_blank",href:"https://docs.bscscan.com/api-endpoints/tokens#get-bep-20-token-totalsupply-by-contractaddress"}," Get BEP-20 Token TotalSupply by ContractAddress"))),(0,r.kt)("h3",{id:"get-bep-20-token-circulatingsupply-by-contractaddress"},"\ud83d\udcb0Get BEP-20 Token CirculatingSupply by ContractAddress"),(0,r.kt)("h4",{id:"returns-the-current-circulating-supply-of-a-bep-20-token"},"Returns the current circulating supply of a BEP-20 token."),(0,r.kt)(s.Z,{mdxType:"Tabs"},(0,r.kt)(c.Z,{value:"request",label:"Request",default:!0,mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-jsx"},'//Sample Request \ud83c\udf4e\n var bep20TokenCirculatingSupply =\n                await _bscScanTokensService\n                    .GetBep20TokenCirculatingSupplyByContractAddressAsync("0xe9e7cea3dedca5984780bafc599bd69add087d56");\n'))),(0,r.kt)(c.Z,{value:"response",label:"Response",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},'//will return a new object TokenCirculatingSupply with values: \ud83c\udf4a\nvar bep20TokenCirculatingSupply = new TokenCirculatingSupply\n    {   \n        Status="1",\n        Message="Ok",\n        Result= "4746460241010889509591673721"\n    };\n'))),(0,r.kt)(c.Z,{value:"...",label:"...",mdxType:"TabItem"},"\ud83c\udf4c For more information Check out",(0,r.kt)("a",{target:"_blank",href:"https://docs.bscscan.com/api-endpoints/tokens#get-bep-20-token-circulatingsupply-by-contractaddress"}," Get BEP-20 Token CirculatingSupply by ContractAddress"))),(0,r.kt)("h3",{id:"get-bep-20-token-account-balance-by-contractaddress"},"\ud83d\udcb0Get BEP-20 Token Account Balance by ContractAddress"),(0,r.kt)("h4",{id:"returns-the-current-balance-of-a-bep-20-token-of-an-address"},"Returns the current balance of a BEP-20 token of an address."),(0,r.kt)(s.Z,{mdxType:"Tabs"},(0,r.kt)(c.Z,{value:"request",label:"Request",default:!0,mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-jsx"},'//Sample Request \ud83c\udf4e\n var bep20TokenAccountBalance =\n      await _bscScanTokensService\n            .GetBep20TokenAccountBalanceByContractAddressAsync(contractAddress:"0xe9e7cea3dedca5984780bafc599bd69add087d56",\n                                                                address:"0x89e73303049ee32919903c09e8de5629b84f59eb");\n'))),(0,r.kt)(c.Z,{value:"response",label:"Response",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},'//will return a new object TokenAccountBalance with values: \ud83c\udf4a\nvar bep20TokenAccountBalance = new TokenAccountBalance\n    {   \n        Status="1",\n        Message="Ok",\n        Result= "10999999999999961606"\n    };\n'))),(0,r.kt)(c.Z,{value:"...",label:"...",mdxType:"TabItem"},"\ud83c\udf4c For more information Check out",(0,r.kt)("a",{target:"_blank",href:"https://docs.bscscan.com/api-endpoints/tokens#get-bep-20-token-account-balance-by-contractaddress"}," Get BEP-20 Token Account Balance by ContractAddress"))),(0,r.kt)("h3",{id:"get-token-holder-list-by-contract-address\ud83c\udd7f\ud83c\udd81\ud83c\udd7e"},"\ud83d\udcb0Get Token Holder List by Contract Address",(0,r.kt)("inlineCode",{parentName:"h3"},"\ud83c\udd7f\ud83c\udd81\ud83c\udd7e")),(0,r.kt)("h4",{id:"return-the-current-token-holders-and-number-of-tokens-held"},"Return the current token holders and number of tokens held."),(0,r.kt)(s.Z,{mdxType:"Tabs"},(0,r.kt)(c.Z,{value:"request",label:"Request",default:!0,mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-jsx"},'//Sample Request \ud83c\udf4e\nvar parameters = new TokenHolderListRequest\n            {\n                ContractAddress = "0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82",\n                Page = 1,\n                OffSet = 10\n            };\nvar tokenHolderList = await _bscScanTokensService.GetTokenHolderListByContractAddressAsync(parameters);\n'))),(0,r.kt)(c.Z,{value:"response",label:"Response",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},'//will return a new object TokenHolderList with values: \ud83c\udf4a\nvar tokenHolderList = new TokenHolderList\n    {   \n        Status="1",\n        Message="Ok",\n        Result= new List<TokenHolderListItem>\n            {\n                new()\n                {\n                    TokenHolderAddress="0x0000000000000000000000000000000000000000",\n                    TokenHolderQuantity="0"\n                },\n                new()\n                {\n                    TokenHolderAddress="0x0000000000000000000000000000000000000001",\n                    TokenHolderQuantity="1136630046187908600061"\n                },\n                new()\n                {\n                    TokenHolderAddress="0x0000000000000000000000000000000000001004",\n                    TokenHolderQuantity="385642396146098637680574"\n                },\n                new()\n                {\n                    TokenHolderAddress="0x00000000100f9d75535cbf23f82e23db5558e8c1",\n                    TokenHolderQuantity="25536632618506"\n                }\n            }\n    };\n'))),(0,r.kt)(c.Z,{value:"...",label:"...",mdxType:"TabItem"},"\ud83c\udf4c For more information Check out",(0,r.kt)("a",{target:"_blank",href:"https://docs.bscscan.com/api-endpoints/tokens#get-token-holder-list-by-contract-address"}," Get Token Holder List by Contract Address `\ud83c\udd7f\ud83c\udd81\ud83c\udd7e` "))),(0,r.kt)("h3",{id:"get-historical-bep-20-token-totalsupply-by-contractaddress--blockno\ud83c\udd7f\ud83c\udd81\ud83c\udd7e"},"\ud83d\udcb0Get Historical BEP-20 Token TotalSupply by ContractAddress & BlockNo",(0,r.kt)("inlineCode",{parentName:"h3"},"\ud83c\udd7f\ud83c\udd81\ud83c\udd7e")),(0,r.kt)("h4",{id:"returns-the-historical-amount-of-a-bep-20-token-in-circulation-at-a-certain-block-height"},"Returns the historical amount of a BEP-20 token in circulation at a certain block height."),(0,r.kt)(s.Z,{mdxType:"Tabs"},(0,r.kt)(c.Z,{value:"request",label:"Request",default:!0,mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-jsx"},'//Sample Request \ud83c\udf4e\n  var historicalBep20TokenTotalSupply =\n                await _bscScanTokensService\n                    .GetHistoricalBep20TokenTotalSupplyByContractAddressAndBlockNoAsync\n                                        (contractAddress:"0xc9849e6fdb743d08faee3e34dd2d1bc69ea11a51",\n                                         blockNo:4000000);\n'))),(0,r.kt)(c.Z,{value:"response",label:"Response",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},'//will return a new object HistoricalBep20TokenTotalSupply with values: \ud83c\udf4a\nvar historicalBep20TokenTotalSupply = new HistoricalBep20TokenTotalSupply\n    {   \n        Status="1",\n        Message="Ok",\n        Result= "21265524714464"\n    };\n'))),(0,r.kt)(c.Z,{value:"...",label:"...",mdxType:"TabItem"},"\ud83c\udf4c For more information Check out",(0,r.kt)("a",{target:"_blank",href:"https://docs.bscscan.com/api-endpoints/tokens#get-historical-bep-20-token-totalsupply-by-contractaddress-and-blockno"}," Get Historical BEP-20 Token TotalSupply by ContractAddress & BlockNo `\ud83c\udd7f\ud83c\udd81\ud83c\udd7e` "))),(0,r.kt)("h3",{id:"get-historical-bep-20-token-account-balance-by-contractaddress--blockno\ud83c\udd7f\ud83c\udd81\ud83c\udd7e"},"\ud83d\udcb0Get Historical BEP-20 Token Account Balance by ContractAddress & BlockNo",(0,r.kt)("inlineCode",{parentName:"h3"},"\ud83c\udd7f\ud83c\udd81\ud83c\udd7e")),(0,r.kt)("h4",{id:"returns-the-balance-of-a-bep-20-token-of-an-address-at-a-certain-block-height"},"Returns the balance of a BEP-20 token of an address at a certain block height."),(0,r.kt)(s.Z,{mdxType:"Tabs"},(0,r.kt)(c.Z,{value:"request",label:"Request",default:!0,mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-jsx"},'//Sample Request \ud83c\udf4e\nvar parameters = new HistoricalBep20TokenAccountBalanceRequest\n            {\n                ContractAddress = "0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82",\n                Address ="0x7bb89460599dbf32ee3aa50798bbceae2a5f7f6a",\n                BlockNo = 4000000\n            };\nvar historicalBep20AccountBalance =\n                await _bscScanTokensService\n                    .GetHistoricalBep20TokenAccountBalanceByContractAddressAndBlockNoAsync(parameters);\n'))),(0,r.kt)(c.Z,{value:"response",label:"Response",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},'//will return a new object HistoricalBep20TokenAccountBalance with values: \ud83c\udf4a\nvar historicalBep20AccountBalance = new HistoricalBep20TokenAccountBalance\n    {   \n        Status="1",\n        Message="Ok",\n        Result= "135499"\n    };\n'))),(0,r.kt)(c.Z,{value:"...",label:"...",mdxType:"TabItem"},"\ud83c\udf4c For more information Check out",(0,r.kt)("a",{target:"_blank",href:"https://docs.bscscan.com/api-endpoints/tokens#get-historical-bep-20-token-account-balance-by-contractaddress-and-blockno"}," Get Historical BEP-20 Token Account Balance by ContractAddress & BlockNo`\ud83c\udd7f\ud83c\udd81\ud83c\udd7e` "))),(0,r.kt)("h3",{id:"get-token-info-by-contractaddress\ud83c\udd7f\ud83c\udd81\ud83c\udd7e"},"\ud83d\udcb0Get Token Info by ContractAddress",(0,r.kt)("inlineCode",{parentName:"h3"},"\ud83c\udd7f\ud83c\udd81\ud83c\udd7e")),(0,r.kt)("h4",{id:"returns-project-information-and-social-media-links-of-a-bep-20bep-721-token"},"Returns project information and social media links of a BEP-20/BEP-721 token."),(0,r.kt)(s.Z,{mdxType:"Tabs"},(0,r.kt)(c.Z,{value:"request",label:"Request",default:!0,mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-jsx"},'//Sample Request \ud83c\udf4e\nvar tokenInfo = await _bscScanTokensService\n                 .GetTokenInfoByContractAddressAsync("0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82");\n'))),(0,r.kt)(c.Z,{value:"response",label:"Response",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},'//will return a new object TokenInfo with values: \ud83c\udf4a\nvar tokenInfo = new TokenInfo\n            {\n                Status = "1",\n                Message = "Ok",\n                Result = new List<TokenInfoData>\n                {\n                    new()\n                    {\n                        ContractAddress = "0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82",\n                        TokenName = "PancakeSwap Token",\n                        Symbol = "Cake",\n                        Divisor = "18",\n                        TokenType = "ERC20",\n                        TotalSupply = "431889535.843059000000000000",\n                        BlueCheckmark = "true",\n                        Description = "PancakeSwap is a yield farming project whereby users can get FLIP (LP token) for staking and get CAKE token as reward. CAKE holders can swap CAKE for SYRUP for additional incentivized staking.",\n                        Website = "https://pancakeswap.finance/",\n                        Email = "PancakeSwap@gmail.com",\n                        Blog = "https://medium.com/@pancakeswap",\n                        Reddit = "",\n                        Slack = "",\n                        Facebook = "",\n                        Twitter = "https://twitter.com/pancakeswap",\n                        BitcoinTalk = "",\n                        Github = "https://github.com/pancakeswap",\n                        Telegram = "https://t.me/PancakeSwap",\n                        WeChat = "",\n                        LinkedIn = "",\n                        Discord = "",\n                        WhitePaper = "",\n                       TokenPriceUsd = "23.9300000000"\n                    }\n                }\n            };\n'))),(0,r.kt)(c.Z,{value:"...",label:"...",mdxType:"TabItem"},"\ud83c\udf4c For more information Check out",(0,r.kt)("a",{target:"_blank",href:"https://docs.bscscan.com/api-endpoints/tokens#get-token-info-by-contractaddress"}," Get Token Info by ContractAddress `\ud83c\udd7f\ud83c\udd81\ud83c\udd7e` "))))}m.isMDXComponent=!0}}]);