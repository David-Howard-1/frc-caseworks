//#region \0tanstack-start-manifest:v
var tsrStartManifest = () => ({ routes: {
	__root__: {
		filePath: "C:/Users/david/Documents/code-projects/frc-caseworks/src/routes/__root.tsx",
		children: [
			"/",
			"/cases",
			"/reports"
		],
		css: ["/assets/index-C_XpPWYu.css"],
		preloads: ["/assets/index-DWDC92WD.js", "/assets/useDemoWorkspace-D9UmQCXb.js"],
		scripts: [{ attrs: {
			type: "module",
			async: !0,
			src: "/assets/index-DWDC92WD.js"
		} }]
	},
	"/": {
		filePath: "C:/Users/david/Documents/code-projects/frc-caseworks/src/routes/index.tsx",
		children: void 0,
		preloads: [
			"/assets/routes-C3Jl3iR5.js",
			"/assets/CaseworkUI-C2lheeM4.js",
			"/assets/SimpleGrid-CWiRUpTP.js",
			"/assets/dollar-sign-zuRC31cu.js"
		]
	},
	"/cases": {
		filePath: "C:/Users/david/Documents/code-projects/frc-caseworks/src/routes/cases.tsx",
		children: ["/cases/$caseId"],
		preloads: [
			"/assets/cases-B48t1lpj.js",
			"/assets/CaseworkUI-C2lheeM4.js",
			"/assets/TextInput-DhMNMjLp.js"
		]
	},
	"/reports": {
		filePath: "C:/Users/david/Documents/code-projects/frc-caseworks/src/routes/reports.tsx",
		children: void 0,
		preloads: [
			"/assets/reports-B_msXlUJ.js",
			"/assets/CaseworkUI-C2lheeM4.js",
			"/assets/SimpleGrid-CWiRUpTP.js"
		]
	},
	"/cases/$caseId": {
		filePath: "C:/Users/david/Documents/code-projects/frc-caseworks/src/routes/cases.$caseId.tsx",
		children: void 0,
		preloads: [
			"/assets/cases._caseId-DZxQbIdi.js",
			"/assets/SimpleGrid-CWiRUpTP.js",
			"/assets/dollar-sign-zuRC31cu.js"
		]
	}
} });
//#endregion
export { tsrStartManifest };
