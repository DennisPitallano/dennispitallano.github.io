"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[4569],{3905:function(e,t,a){a.d(t,{Zo:function(){return c},kt:function(){return m}});var n=a(7294);function r(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function s(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function l(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?s(Object(a),!0).forEach((function(t){r(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):s(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function o(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},s=Object.keys(e);for(n=0;n<s.length;n++)a=s[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(n=0;n<s.length;n++)a=s[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var i=n.createContext({}),d=function(e){var t=n.useContext(i),a=t;return e&&(a="function"==typeof e?e(t):l(l({},t),e)),a},c=function(e){var t=d(e.components);return n.createElement(i.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},p=n.forwardRef((function(e,t){var a=e.components,r=e.mdxType,s=e.originalType,i=e.parentName,c=o(e,["components","mdxType","originalType","parentName"]),p=d(a),m=r,h=p["".concat(i,".").concat(m)]||p[m]||u[m]||s;return a?n.createElement(h,l(l({ref:t},c),{},{components:a})):n.createElement(h,l({ref:t},c))}));function m(e,t){var a=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var s=a.length,l=new Array(s);l[0]=p;var o={};for(var i in t)hasOwnProperty.call(t,i)&&(o[i]=t[i]);o.originalType=e,o.mdxType="string"==typeof e?e:r,l[1]=o;for(var d=2;d<s;d++)l[d]=a[d];return n.createElement.apply(null,l)}return n.createElement.apply(null,a)}p.displayName="MDXCreateElement"},8215:function(e,t,a){a.d(t,{Z:function(){return r}});var n=a(7294);function r(e){var t=e.children,a=e.hidden,r=e.className;return n.createElement("div",{role:"tabpanel",hidden:a,className:r},t)}},9877:function(e,t,a){a.d(t,{Z:function(){return c}});var n=a(3117),r=a(7294),s=a(2389),l=a(9575),o=a(6010),i="tabItem_LplD";function d(e){var t,a,s,d=e.lazy,c=e.block,u=e.defaultValue,p=e.values,m=e.groupId,h=e.className,f=r.Children.map(e.children,(function(e){if((0,r.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),v=null!=p?p:f.map((function(e){var t=e.props;return{value:t.value,label:t.label,attributes:t.attributes}})),b=(0,l.lx)(v,(function(e,t){return e.value===t.value}));if(b.length>0)throw new Error('Docusaurus error: Duplicate values "'+b.map((function(e){return e.value})).join(", ")+'" found in <Tabs>. Every value needs to be unique.');var g=null===u?u:null!=(t=null!=u?u:null==(a=f.find((function(e){return e.props.default})))?void 0:a.props.value)?t:null==(s=f[0])?void 0:s.props.value;if(null!==g&&!v.some((function(e){return e.value===g})))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+g+'" but none of its children has the corresponding value. Available values are: '+v.map((function(e){return e.value})).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");var k=(0,l.UB)(),y=k.tabGroupChoices,w=k.setTabGroupChoices,T=(0,r.useState)(g),S=T[0],P=T[1],N=[],x=(0,l.o5)().blockElementScrollPositionUntilNextRender;if(null!=m){var C=y[m];null!=C&&C!==S&&v.some((function(e){return e.value===C}))&&P(C)}var A=function(e){var t=e.currentTarget,a=N.indexOf(t),n=v[a].value;n!==S&&(x(t),P(n),null!=m&&w(m,n))},L=function(e){var t,a=null;switch(e.key){case"ArrowRight":var n=N.indexOf(e.currentTarget)+1;a=N[n]||N[0];break;case"ArrowLeft":var r=N.indexOf(e.currentTarget)-1;a=N[r]||N[N.length-1]}null==(t=a)||t.focus()};return r.createElement("div",{className:"tabs-container"},r.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,o.Z)("tabs",{"tabs--block":c},h)},v.map((function(e){var t=e.value,a=e.label,s=e.attributes;return r.createElement("li",(0,n.Z)({role:"tab",tabIndex:S===t?0:-1,"aria-selected":S===t,key:t,ref:function(e){return N.push(e)},onKeyDown:L,onFocus:A,onClick:A},s,{className:(0,o.Z)("tabs__item",i,null==s?void 0:s.className,{"tabs__item--active":S===t})}),null!=a?a:t)}))),d?(0,r.cloneElement)(f.filter((function(e){return e.props.value===S}))[0],{className:"margin-vert--md"}):r.createElement("div",{className:"margin-vert--md"},f.map((function(e,t){return(0,r.cloneElement)(e,{key:t,hidden:e.props.value!==S})}))))}function c(e){var t=(0,s.Z)();return r.createElement(d,(0,n.Z)({key:String(t)},e))}},7292:function(e,t,a){a.r(t),a.d(t,{assets:function(){return p},contentTitle:function(){return c},default:function(){return f},frontMatter:function(){return d},metadata:function(){return u},toc:function(){return m}});var n=a(3117),r=a(102),s=(a(7294),a(3905)),l=a(9877),o=a(8215),i=["components"],d={sidebar_position:10,id:"slp-api",title:"\ud83c\udfafSLP API"},c=void 0,u={unversionedId:"cash-netcore/slp-api",id:"cash-netcore/slp-api",title:"\ud83c\udfafSLP API",description:"For more details visit BCH APIs page.",source:"@site/docs/cash-netcore/slp-api.mdx",sourceDirName:"cash-netcore",slug:"/cash-netcore/slp-api",permalink:"/docs/cash-netcore/slp-api",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/cash-netcore/slp-api.mdx",tags:[],version:"current",sidebarPosition:10,frontMatter:{sidebar_position:10,id:"slp-api",title:"\ud83c\udfafSLP API"},sidebar:"tutorialSidebar",previous:{title:"\ud83c\udfafRaw Transaction API",permalink:"/docs/cash-netcore/raw-transaction-api"},next:{title:"\ud83c\udfafUtil API",permalink:"/docs/cash-netcore/util-api"}},p={},m=[{value:"\ud83d\udcb0Convert address to slpAddr, cashAddr and legacy.",id:"convert-address-to-slpaddr-cashaddr-and-legacy",level:3},{value:"Convert address to slpAddr, cashAddr and legacy.",id:"convert-address-to-slpaddr-cashaddr-and-legacy-1",level:4},{value:"\ud83d\udcb0Convert multiple addresses to cash, legacy and simpleledger format.",id:"convert-multiple-addresses-to-cash-legacy-and-simpleledger-format",level:3},{value:"Convert multiple addresses to cash, legacy and simpleledger format.",id:"convert-multiple-addresses-to-cash-legacy-and-simpleledger-format-1",level:4},{value:"\ud83d\udcb0SLP token whitelist.",id:"slp-token-whitelist",level:3},{value:"Get tokens that are on the whitelist. SLPDB is typically used to validate SLP transactions. It can become unstable during periods of high network usage. A second SLPDB has been implemented that is much more stable, because it only tracks a whitelist of SLP tokens. This endpoint will return information on the SLP tokens that are included in that whitelist.",id:"get-tokens-that-are-on-the-whitelist-slpdb-is-typically-used-to-validate-slp-transactions-it-can-become-unstable-during-periods-of-high-network-usage-a-second-slpdb-has-been-implemented-that-is-much-more-stable-because-it-only-tracks-a-whitelist-of-slp-tokens-this-endpoint-will-return-information-on-the-slp-tokens-that-are-included-in-that-whitelist",level:4}],h={toc:m};function f(e){var t=e.components,a=(0,r.Z)(e,i);return(0,s.kt)("wrapper",(0,n.Z)({},h,a,{components:t,mdxType:"MDXLayout"}),(0,s.kt)("div",{className:"admonition admonition-success alert alert--success"},(0,s.kt)("div",{parentName:"div",className:"admonition-heading"},(0,s.kt)("h5",{parentName:"div"},(0,s.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,s.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"12",height:"16",viewBox:"0 0 12 16"},(0,s.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.5 0C3.48 0 1 2.19 1 5c0 .92.55 2.25 1 3 1.34 2.25 1.78 2.78 2 4v1h5v-1c.22-1.22.66-1.75 2-4 .45-.75 1-2.08 1-3 0-2.81-2.48-5-5.5-5zm3.64 7.48c-.25.44-.47.8-.67 1.11-.86 1.41-1.25 2.06-1.45 3.23-.02.05-.02.11-.02.17H5c0-.06 0-.13-.02-.17-.2-1.17-.59-1.83-1.45-3.23-.2-.31-.42-.67-.67-1.11C2.44 6.78 2 5.65 2 5c0-2.2 2.02-4 4.5-4 1.22 0 2.36.42 3.22 1.19C10.55 2.94 11 3.94 11 5c0 .66-.44 1.78-.86 2.48zM4 14h5c-.23 1.14-1.3 2-2.5 2s-2.27-.86-2.5-2z"}))),"Notes")),(0,s.kt)("div",{parentName:"div",className:"admonition-content"},(0,s.kt)("p",{parentName:"div"},"For more details visit ",(0,s.kt)("a",{parentName:"p",href:"https://api.fullstack.cash/docs/#api-SLP"},"BCH APIs")," page."))),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-jsx"},"//imports\nusing Cash.NetCore.Contracts;\nusing Cash.NetCore.Models.Response.Slp;\n//inject\nprivate readonly ISlpService _slpService;\n")),(0,s.kt)("h3",{id:"convert-address-to-slpaddr-cashaddr-and-legacy"},"\ud83d\udcb0Convert address to slpAddr, cashAddr and legacy."),(0,s.kt)("h4",{id:"convert-address-to-slpaddr-cashaddr-and-legacy-1"},"Convert address to slpAddr, cashAddr and legacy."),(0,s.kt)(l.Z,{mdxType:"Tabs"},(0,s.kt)(o.Z,{value:"request",label:"Request",default:!0,mdxType:"TabItem"},(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-jsx"},'//Sample Request \ud83c\udf4e\nvar address = await _slpService!.GetConvertAddressAsync(\n            "simpleledger:qz9tzs6d5097ejpg279rg0rnlhz546q4fsnck9wh5m");\n'))),(0,s.kt)(o.Z,{value:"response",label:"Response",mdxType:"TabItem"},(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-jsx"},'//will return SlpConvertAddress: \ud83c\udf4a\nvar address = new SlpConvertAddress\n        {\n           SlpAddress = "simpleledger:qz9tzs6d5097ejpg279rg0rnlhz546q4fsnck9wh5m",\n           CashAddress = "bitcoincash:qz9tzs6d5097ejpg279rg0rnlhz546q4fslra7mh29",\n           LegacyAddress = "1DeLbv5EMzLEFDvQ8wZiKeSuPGGtSSz5HP"\n        };\n'))),(0,s.kt)(o.Z,{value:"...",label:"...",mdxType:"TabItem"},"\ud83c\udf4c For more information Check out  ",(0,s.kt)("a",{target:"_blank",href:"https://api.fullstack.cash/docs/#api-SLP-Convert_address_to_slpAddr,_cashAddr_and_legacy."},"Convert address to slpAddr, cashAddr and legacy."))),(0,s.kt)("h3",{id:"convert-multiple-addresses-to-cash-legacy-and-simpleledger-format"},"\ud83d\udcb0Convert multiple addresses to cash, legacy and simpleledger format."),(0,s.kt)("h4",{id:"convert-multiple-addresses-to-cash-legacy-and-simpleledger-format-1"},"Convert multiple addresses to cash, legacy and simpleledger format."),(0,s.kt)(l.Z,{mdxType:"Tabs"},(0,s.kt)(o.Z,{value:"request",label:"Request",default:!0,mdxType:"TabItem"},(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-jsx"},'//Sample Request \ud83c\udf4e\n var addresses = await _slpService!.GetConvertAddressesAsync(new[]\n        {\n            "simpleledger:qrxa0unrn67rtn85v7asfddhhth43ecnxua0antk2l",\n            "simpleledger:qz9tzs6d5097ejpg279rg0rnlhz546q4fsnck9wh5m"\n        });\n'))),(0,s.kt)(o.Z,{value:"response",label:"Response",mdxType:"TabItem"},(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-jsx"},'//will return List<SlpConvertAddress>: \ud83c\udf4a\n   var addresses = new List<SlpConvertAddress>()\n        {\n            new()\n            {\n                SlpAddress = "simpleledger:qrxa0unrn67rtn85v7asfddhhth43ecnxua0antk2l",\n                CashAddress = "bitcoincash:qrxa0unrn67rtn85v7asfddhhth43ecnxu35kg7k5p",\n                LegacyAddress = "1KmQDaJdUDwwEFRwVwGwTqJ9gqBzyGYzjY"\n            },\n            new()\n            {\n                SlpAddress = "simpleledger:qz9tzs6d5097ejpg279rg0rnlhz546q4fsnck9wh5m",\n                CashAddress = "bitcoincash:qz9tzs6d5097ejpg279rg0rnlhz546q4fslra7mh29",\n                LegacyAddress = "1DeLbv5EMzLEFDvQ8wZiKeSuPGGtSSz5HP"\n            }\n        };\n'))),(0,s.kt)(o.Z,{value:"...",label:"...",mdxType:"TabItem"},"\ud83c\udf4c For more information Check out  ",(0,s.kt)("a",{target:"_blank",href:"https://api.fullstack.cash/docs/#api-SLP-Convert_multiple_addresses_to_cash,_legacy_and_simpleledger_format."},"Convert multiple addresses to cash, legacy and simpleledger format."))),(0,s.kt)("h3",{id:"slp-token-whitelist"},"\ud83d\udcb0SLP token whitelist."),(0,s.kt)("h4",{id:"get-tokens-that-are-on-the-whitelist-slpdb-is-typically-used-to-validate-slp-transactions-it-can-become-unstable-during-periods-of-high-network-usage-a-second-slpdb-has-been-implemented-that-is-much-more-stable-because-it-only-tracks-a-whitelist-of-slp-tokens-this-endpoint-will-return-information-on-the-slp-tokens-that-are-included-in-that-whitelist"},"Get tokens that are on the whitelist. SLPDB is typically used to validate SLP transactions. It can become unstable during periods of high network usage. A second SLPDB has been implemented that is much more stable, because it only tracks a whitelist of SLP tokens. This endpoint will return information on the SLP tokens that are included in that whitelist."),(0,s.kt)("p",null,"For tokens on the whitelist, the /slp/validateTxid3 endpoints can be used."),(0,s.kt)(l.Z,{mdxType:"Tabs"},(0,s.kt)(o.Z,{value:"request",label:"Request",default:!0,mdxType:"TabItem"},(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-jsx"},"//Sample Request \ud83c\udf4e\n  var tokens = await _slpService!.GetTokenWhitelistAsync();\n"))),(0,s.kt)(o.Z,{value:"response",label:"Response",mdxType:"TabItem"},(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-jsx"},'//will return  List<SlpTokenWhitelist>: \ud83c\udf4a\n  var tokens = new List<SlpTokenWhitelist>\n        {\n            new()\n            {\n                Name = "USDH",\n                TokenId = "c4b0d62156b3fa5c8f3436079b5394f7edc1bef5dc1cd2f9d0c4d46f82cca479"\n            },\n            new()\n            {\n                Name = "SPICE",\n                TokenId = "4de69e374a8ed21cbddd47f2338cc0f479dc58daa2bbe11cd604ca488eca0ddf"\n            },\n            new()\n            {\n                Name = "PSF",\n                TokenId = "38e97c5d7d3585a2cbf3f9580c82ca33985f9cb0845d4dcce220cb709f9538b0"\n            },\n            new()\n            {\n                Name = "TROUT",\n                TokenId = "a4fb5c2da1aa064e25018a43f9165040071d9e984ba190c222a7f59053af84b2"\n            },\n            new()\n            {\n                Name = "PSFTEST",\n                TokenId = "d0ef4de95b78222bfee2326ab11382f4439aa0855936e2fe6ac129a8d778baa0"\n            }\n        };\n'))),(0,s.kt)(o.Z,{value:"...",label:"...",mdxType:"TabItem"},"\ud83c\udf4c For more information Check out  ",(0,s.kt)("a",{target:"_blank",href:"https://api.fullstack.cash/docs/#api-SLP-SLP_token_whitelist"},"SLP token whitelist."))))}f.isMDXComponent=!0}}]);