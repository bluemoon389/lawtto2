document.addEventListener('DOMContentLoaded', () => {
    // Show the home page by default
    showPage('home');
});

let currentPage = 'home';
let currentCaseResultKey = null;
let majorProjectsCurrentPageIndex = 0;

function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page-content').forEach(page => {
        page.classList.add('hidden');
    });

    // Show the selected page
    const pageToShow = document.getElementById(pageId);
    if (pageToShow) {
        pageToShow.classList.remove('hidden');
    }

    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.dataset.page === pageId || (pageId === 'lawyer-detail' && link.dataset.page === 'about')) {
             link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    currentPage = pageId;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

const lawyersData = {
    ryu: {
        name: "류창용 변호사 (대표 변호사)",
        content: `
            <p class="text-gray-300 leading-relaxed text-lg mb-4">
                류창용 변호사는 2009년부터 토지 및 수용 사건을 주로 담당하며 이 분야에서 깊이 있는 전문성을 쌓아왔습니다.
                2009년부터 현재까지 사단법인 한국토지보상법연구회에 소속되어 토지 보상 실무에 대한 연구 활동 및 다수의 논문을 발표했고,
                현재는 연구이사로서 각종 연구회 학술활동을 주도하고 있습니다.
            </p>
            <h4 class="text-xl font-semibold text-blue-300 mt-6 mb-2">Profile</h4>
            <ul class="list-disc list-inside ml-4 space-y-1 text-gray-300">
                <li>고려대학교 법학과 졸업</li>
                <li>사법연수원 30기 수료 (2000)</li>
                <li>변호사 / 세무사</li>
            </ul>
            <h4 class="text-xl font-semibold text-blue-300 mt-6 mb-2">기타 이력</h4>
            <ul class="list-disc list-inside ml-4 space-y-1 text-gray-300">
                <li>대한변협 전문분야 토지수용및보상 등록</li>
                <li>경기주택도시공사(GH) 인사위원회 위원</li>
                <li>(사)한국토지보상법연구회 연구이사</li>
                <li>화성 송산그린시티 보상협의회 전문위원</li>
                <li>경기도 장학관 무료법률지원단 고문</li>
                <li>김포 풍무 역세권 주민대책위, 세종 국가산단 주민대책위 등 다수의 보상지역 주민대책위 법률자문 수행</li>
                <li>주요 논문: "잔여지 손실 유형 및 권리 구제 측면의 실무상 쟁점 (2023, 한국토지보상법연구)", "잔여지 보상실무에 있어서 권리구제측면의 문제점 및 개선방안"</li>
                <li>법조신문 전문가 칼럼 게재 (2024~)</li>
            </ul>
        `
    },
    yoo: {
        name: "유동현 변호사 (소속 변호사)",
        content: `
            <p class="text-gray-300 leading-relaxed text-lg mb-4">
                유동현 변호사는 토지 및 수용 사건 분야의 전문성을 갖춘 소속 변호사입니다.
                류창용 변호사와 함께 사단법인 한국토지보상법연구회 정회원으로 활동하며 다수의 논문을 발표하는 등 활발한 연구 활동을 이어가고 있습니다.
                유동현 변호사는 이론적 지식과 실무 경험을 겸비하여 의뢰인에게 최적의 법률 서비스를 제공하고 있습니다.
                특히 복잡하고 난해한 토지 보상 분쟁에서 명확한 해결책을 제시하며 의뢰인에게 큰 신뢰를 얻고 있습니다.
            </p>
            <h4 class="text-xl font-semibold text-blue-300 mt-6 mb-2">Profile</h4>
            <ul class="list-disc list-inside ml-4 space-y-1 text-gray-300">
                <li>건국대학교 로스쿨 9기</li>
                <li>공공정책법무 석사</li>
            </ul>
            <h4 class="text-xl font-semibold text-blue-300 mt-6 mb-2">기타 이력</h4>
            <ul class="list-disc list-inside ml-4 space-y-1 text-gray-300">
                <li>(사)한국토지보상법연구회 정회원</li>
                <li>감정평가서, 현장조사서 검토업무</li>
                <li>평택동부고속화도로 사업 대책위 자문</li>
                <li>도시자연공원 매수청구 등 민원자문</li>
                <li>다수의 종중, 종친회 자문</li>
                <li>다수의 보상지구 대책위 자문</li>
                <li>주요 논문: "이전비 산정의 보완점 - 예술적, 전통적 가치의 감정평가방식과 관련하여(2023, 한국토지보상법연구)", "장기미집행 도시계획시설 보상의 불완전성에 따른 분쟁(2021, 한국토지보상법연구)"</li>
            </ul>
        `
    }
};

const practiceAreasData = {
    area1: {
        title: "토지 보상 및 수용 사건 일반",
        content: `
            <p>수용재결, 이의재결, 보상금증액소송 등 토지 수용 및 보상과 관련된 모든 법률 분쟁을 다룹니다. 정당한 보상을 받지 못했거나 수용 절차에 이의가 있는 경우, 의뢰인의 권익을 최대한 보호하기 위해 법률적 조력을 제공합니다.</p>
            <ul class="list-disc list-inside mt-4 space-y-2">
                <li>수용재결 및 이의재결 신청 대리</li>
                <li>보상금 증액을 위한 행정소송 및 민사소송</li>
                <li>사업 인정 및 수용 재결 취소 소송</li>
                <li>보상금 산정의 적정성 검토 및 이의 제기</li>
            </ul>
        `
    },
    area2: {
        title: "도로, 철도사업 관련 민원 및 소송",
        content: `
            <p>도로, 철도 등 공익사업으로 인한 토지 수용 시 발생하는 잔여지 매수 청구, 설계 변경 관련 민원 및 소송을 전문적으로 처리합니다. 공익사업으로 인해 재산상 피해를 입은 경우, 법률적 검토를 통해 최적의 해결 방안을 모색합니다.</p>
            <ul class="list-disc list-inside mt-4 space-y-2">
                <li>잔여지 매수 청구 소송</li>
                <li>설계 변경으로 인한 피해 보상 소송</li>
                <li>도로, 철도 사업 관련 행정 소송 및 민사 소송</li>
                <li>사업 시행자와의 협상 및 조정 대리</li>
            </ul>
        `
    },
    area3: {
        title: "장기미집행 도시계획시설(공원) 관련 민원 및 소송",
        content: `
            <p>장기간 집행되지 않은 도시계획시설(공원, 도로 등)로 인해 재산권 행사에 제약을 받는 경우, 매수 청구, 도시계획시설 결정 해제 신청, 손실 보상 청구 등 다양한 법률 서비스를 제공합니다.</p>
            <ul class="list-disc list-inside mt-4 space-y-2">
                <li>도시계획시설 부지 매수 청구 소송</li>
                <li>도시계획시설 결정 해제 신청 대리</li>
                <li>미집행 도시계획시설로 인한 손실 보상 청구</li>
                <li>헌법소원 등 권리 구제 절차 대리</li>
            </ul>
        `
    },
    area4: {
        title: "행정계획 등과 관련된 민원 및 소송",
        content: `
            <p>국민권익위원회 고충민원, 행정처분 취소 소송, 무효 확인 소송 등 각종 행정계획 및 처분과 관련된 민원 및 소송을 담당합니다. 부당한 행정 처분으로부터 의뢰인의 권리를 보호하고 구제합니다.</p>
            <ul class="list-disc list-inside mt-4 space-y-2">
                <li>국민권익위원회 고충민원 신청 대리</li>
                <li>각종 행정처분 취소 및 무효 확인 소송</li>
                <li>행정심판 및 행정소송 대리</li>
                <li>행정계획 변경 및 철회 관련 자문</li>
            </ul>
        `
    },
    area5: {
        title: "공장, 축산 등 특수분야 집단민원 및 소송",
        content: `
            <p>공장, 축산 시설 등 특수 분야 사업의 이전, 철거, 보상 과정에서 발생하는 집단 민원 및 소송을 전문적으로 처리합니다. 복잡한 이해관계와 특수성을 고려하여 의뢰인 집단의 권익을 대변하고 최적의 합의를 이끌어냅니다.</p>
            <ul class="list-disc list-inside mt-4 space-y-2">
                <li>공장, 축산 시설 이전 및 철거 보상 소송</li>
                <li>영업 손실 보상 및 휴업 보상 청구</li>
                <li>특수 시설물 평가 및 보상 관련 자문</li>
                <li>집단 민원 해결을 위한 협상 및 소송 대리</li>
            </ul>
        `
    }
};

const caseResultsData = {
    'major-projects': {
        title: "업무 수행 주요 사업",
        pages: [
            [ // Page 1
                {
                    heading: "고속도로 사업",
                    list: [
                        "서울 문산, 이천-오산 고속도로 민간투자사업, 봉담 송산 고속도로 민간투자사업, 세종 포천 고속도로 건설공사, 파주-양주 고속도로 건설공사, 포천-세종 고속도로 민간투자사업 등",
                        "광주-원주 고속도로 민간투자사업, 구리-포천 고속도로 민간투자사업, 제2경인 고속도로 민간투자사업, 수원-광명 고속도로 민간투자사업, 상주-영천 간 고속도로 건설공사, 인천-김포 고속도로 건설공사 등 다수의 고속도로 등"
                    ],
                    color: "blue"
                },
                {
                    heading: "지방도, 국지도 사업",
                    list: [
                        "남양주 덕송-내각 도로 건설공사, 오포-포곡간 도로 건설공사, 동두천-연천 전철화 공사, 부천-원종간 복선전철 공사, 가남-감곡 도로 확포장 공사, 평택 동부고속화도로 공사, 광주-원주1호선 건설공사, 대전동 181-6 - 1024-10번지 도로개설공사, 국지도 98호선 도로 - 심촌 도로건설공사 등 다수의 지방도, 국지도 사업"
                    ],
                    color: "green"
                }
            ],
            [ // Page 2
                {
                    heading: "철도 사업",
                    list: [
                        "원주-강릉간 철도사업, 장항선 개량 사업, 서해선 철도사업 등 다수의 철도사업"
                    ],
                    color: "purple"
                },
                {
                    heading: "단지개발 사업",
                    list: [
                        "광주 송정지구, 풍무 역세권 개발사업, 광명 가학동 경관광장, 김포 학운3일반산업단지, 안성 동향 산업단지, 판교대장 도시개발사업, 화성 바이오 밸리, 화성 향남 2지구, 대전평촌일반산업단지, 강동일반산업단지, 천안북부BIT일반산업단지, 천안풍세2산업단지, 천안풍세6산업단지, 고양창릉지구, 브레인시티 일반산업단지, 오송 바이오 산업단지 등 다수의 단지개발 사업"
                    ],
                    color: "yellow"
                },
                {
                    heading: "장기미집행 도시계획시설",
                    list: [
                        "봉재근린공원, 상하1근린공원, 양안근린공원, 송산근린공원, 사다리근린공원, 광주역세권근린공원, 마산근린공원, 이천설봉근린공원, 백산근린공원, 매화근린공원, 안성공원, 덕구근린공원 등 다수의 도시계획시설"
                    ],
                    color: "red"
                }
            ]
        ]
    },
    'successful-cases': {
        title: "주요 업무 성공 사례",
        pages: [
            [ // Page 1
                {
                    heading: "사례 1: 연안김씨 0000 종회",
                    list: [
                        "1차 의뢰 (서울-문산 고속도로)",
                        "최초 보상금: 약 130억원",
                        "수용재결: +4.66% / 이의재결: +1.21% / 소송: +2.91%",
                        "총 증액율: 8.78%"
                    ],
                    color: "blue"
                },
                {
                    heading: "사례 2: 밀양박씨 0000 종회",
                    list: [
                        "1차 의뢰 (서울-문산 고속도로)",
                        "시행자 반소청구 15억원 승소로 종결",
                        "2차 의뢰 (고양시 재개발사업)",
                        "최초 보상금: 약 38억원",
                        "수용재결: +16% / 이의재결 진행중"
                    ],
                    color: "green"
                },
                {
                    heading: "사례 3: 전주이씨 0000 종중",
                    list: [
                        "최초 보상금: 약 150억원",
                        "수용재결: +4.04% / 이의재결: +2.31% / 소송: +3.97%",
                        "총 증액율: 10.8%"
                    ],
                    color: "purple"
                }
            ],
            [ // Page 2
                {
                    heading: "사례 4: 밀양박씨 0000 종종",
                    list: [
                        "최초 보상금: 약 43억원",
                        "이의재결 및 소송: 총 증액율: 35.89%"
                    ],
                    color: "yellow"
                },
                {
                    heading: "사례 5: 00김씨 00종회",
                    list: [
                        "총회결의 가처분 기각",
                        "수백억원대 매매계약 무사히 완료"
                    ],
                    color: "red"
                },
                {
                    heading: "사례 6: 00박씨 00대종회",
                    list: [
                        "가처분을 통해",
                        "1000억대 종중 빌딩 무단 매각 저지"
                    ],
                    color: "blue"
                }
            ]
        ]
    }
};


function showLawyerDetail(lawyerKey) {
    const lawyer = lawyersData[lawyerKey];
    if (lawyer) {
        document.getElementById('lawyer-detail-name').innerText = lawyer.name;
        document.getElementById('lawyer-detail-content').innerHTML = lawyer.content;
        showPage('lawyer-detail');
    }
}

function hideLawyerDetail() {
    showPage('about');
}

function showPracticeAreaDetail(areaKey) {
    const area = practiceAreasData[areaKey];
    if (area) {
        document.getElementById('practice-area-detail-title').innerText = area.title;
        document.getElementById('practice-area-detail-content').innerHTML = area.content;
        document.getElementById('practice-area-detail-container').classList.remove('hidden');
    }
}

function hidePracticeAreaDetail() {
    document.getElementById('practice-area-detail-container').classList.add('hidden');
}


function showCaseResultDetail(key) {
    currentCaseResultKey = key;
    majorProjectsCurrentPageIndex = 0;
    document.getElementById('case-result-detail-container').classList.remove('hidden');
    renderCaseResultPage();
}

function hideCaseResultDetail() {
    currentCaseResultKey = null;
    document.getElementById('case-result-detail-container').classList.add('hidden');
}

function renderCaseResultPage() {
    if (!currentCaseResultKey) return;

    const detail = caseResultsData[currentCaseResultKey];
    const contentDiv = document.getElementById('case-result-detail-content');
    const pageInfo = document.getElementById('case-result-page-info');
    const prevBtn = document.getElementById('case-result-prev-btn');
    const nextBtn = document.getElementById('case-result-next-btn');

    document.getElementById('case-result-detail-title').innerText = detail.title;
    contentDiv.innerHTML = '';

    const getGradientClass = (color) => {
        switch (color) {
            case 'blue': return 'from-blue-600 to-blue-800';
            case 'green': return 'from-green-600 to-green-800';
            case 'purple': return 'from-purple-600 to-purple-800';
            case 'yellow': return 'from-yellow-600 to-yellow-800';
            case 'red': return 'from-red-600 to-red-800';
            default: return 'from-gray-600 to-gray-800';
        }
    };

    const currentPageData = detail.pages[majorProjectsCurrentPageIndex];
    if (!currentPageData) return;

    currentPageData.forEach(item => {
        const itemDiv = document.createElement('div');
        let listItems = '';
        item.list.forEach(li => {
            listItems += `<li class="list-disc list-inside">${li}</li>`;
        });
        itemDiv.innerHTML = `
            <h4 class="inline-block px-3 py-1 bg-gradient-to-r ${getGradientClass(item.color)} text-white font-semibold rounded-full shadow-md">${item.heading}</h4>
            <ul class="ml-4 mt-2 space-y-1 text-gray-300">${listItems}</ul>
        `;
        contentDiv.appendChild(itemDiv);
    });

    pageInfo.innerText = `${majorProjectsCurrentPageIndex + 1} / ${detail.pages.length}`;
    prevBtn.disabled = majorProjectsCurrentPageIndex === 0;
    nextBtn.disabled = majorProjectsCurrentPageIndex === detail.pages.length - 1;
}

document.getElementById('case-result-prev-btn').addEventListener('click', () => {
    if (majorProjectsCurrentPageIndex > 0) {
        majorProjectsCurrentPageIndex--;
        renderCaseResultPage();
    }
});

document.getElementById('case-result-next-btn').addEventListener('click', () => {
    if (!currentCaseResultKey) return;
    const detail = caseResultsData[currentCaseResultKey];
    if (majorProjectsCurrentPageIndex < detail.pages.length - 1) {
        majorProjectsCurrentPageIndex++;
        renderCaseResultPage();
    }
});


const explainButton = document.getElementById('explainButton');
const legalTermInput = document.getElementById('legalTermInput');
const explanationOutput = document.getElementById('explanationOutput');
let isLoading = false;

explainButton.addEventListener('click', async () => {
    if (isLoading || !legalTermInput.value.trim()) {
        explanationOutput.innerHTML = '<p class="text-red-500">질문할 내용을 입력해 주세요.</p>';
        return;
    }

    isLoading = true;
    explanationOutput.innerHTML = '<div class="spinner"></div> <p class="text-gray-600">답변을 생성 중입니다...</p>';
    explainButton.disabled = true;

    try {
        const prompt = `토지보상 및 수용 관련 질문에 대해 간결하고 이해하기 쉽게 설명해 주세요: "${legalTermInput.value}"`;
        // IMPORTANT: You need to add your own Google AI API key here.
        const apiKey = "YOUR_API_KEY"; // <--- Add your API key here.
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });

        if (!response.ok) {
            throw new Error(`API responded with status ${response.status}`);
        }
        
        const result = await response.json();

        if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
            explanationOutput.innerHTML = `<p>${result.candidates[0].content.parts[0].text.replace(/\n/g, '<br>')}</p>`;
        } else {
            explanationOutput.innerHTML = '<p class="text-red-500">답변을 생성하는 데 실패했습니다. 다시 시도해 주세요.</p>';
        }
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        explanationOutput.innerHTML = `<p class="text-red-500">오류가 발생했습니다: ${error.message}</p>`;
    } finally {
        isLoading = false;
        explainButton.disabled = false;
    }
}); 