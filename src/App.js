import React, { useState, useEffect } from 'react';

// LawttoLogo.js
const LawttoLogo = () => (
    <div className="flex items-center justify-center space-x-2"> {/* Added space-x-2 for spacing between circle and text */}
      {/* Circle with "All" text */}
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-200 shadow-md relative"> {/* Light gray circle */}
        {/* Container for "A" and "ll" to control their alignment */}
        <div className="flex items-baseline leading-none"> {/* Use items-baseline for vertical alignment of different font sizes */}
          <span className="text-2xl font-bold text-black">A</span> {/* Larger A */}
          <span className="text-lg font-bold text-black relative"> {/* Regular ll, relative for positioning the dash */}
            <div className="absolute top-1/2 left-1/2 h-0.5 bg-black rounded-full"
                 style={{ width: '150%', transform: 'translate(-50%, -50%)', boxShadow: '0 1px 3px rgba(0,0,0,0.5)' }}></div> {/* Adjusted top and transform */}
            ll
          </span>
        </div>
      </div>
      {/* Lawtto text with gradient */}
      <div className="text-4xl font-bold">
        <span className="bg-gradient-to-r from-slate-900 to-blue-800 bg-clip-text text-transparent">Law</span>
        <span className="bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">tto</span>
      </div>
    </div>
  );

// App.js
const App = () => {
    const [currentPage, setCurrentPage] = useState('home');
    const [lawyerDetail, setLawyerDetail] = useState(null); // This will hold the data for the lawyer detail page
    const [practiceAreaDetail, setPracticeAreaDetail] = useState(null);
    const [caseResultDetail, setCaseResultDetail] = useState(null);
    const [legalTermInput, setLegalTermInput] = useState('');
    const [explanationOutput, setExplanationOutput] = useState('여기에 법률 용어 설명이 표시됩니다.');
    const [isLoading, setIsLoading] = useState(false);
    const [majorProjectsCurrentPageIndex, setMajorProjectsCurrentPageIndex] = useState(0); // State for major projects & successful cases pagination

    // Data for lawyer details
    const lawyers = {
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

    // Data for practice area details
    const practiceAreasData = {
        area1: {
            title: "토지 보상 및 수용 사건 일반",
            content: `
                <p>수용재결, 이의재결, 보상금증액소송 등 토지 수용 및 보상과 관련된 모든 법률 분쟁을 다룹니다. 정당한 보상을 받지 못했거나 수용 절차에 이의가 있는 경우, 의뢰인의 권익을 최대한 보호하기 위해 법률적 조력을 제공합니다.</p>
                <ul className="list-disc list-inside mt-4 space-y-2">
                    <li>수용재결 및 이의재결 신청 대리</li>
                    <li>보상금 증액을 위한 행정소송 및 민사소송</li>
                    <li>사업 인정 및 수용 재결 취송 소송</li>
                    <li>보상금 산정의 적정성 검토 및 이의 제기</li>
                </ul>
            `
        },
        area2: {
            title: "도로, 철도사업 관련 민원 및 소송",
            content: `
                <p>도로, 철도 등 공익사업으로 인한 토지 수용 시 발생하는 잔여지 매수 청구, 설계 변경 관련 민원 및 소송을 전문적으로 처리합니다. 공익사업으로 인해 재산상 피해를 입은 경우, 법률적 검토를 통해 최적의 해결 방안을 모색합니다.</p>
                <ul className="list-disc list-inside mt-4 space-y-2">
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
                <ul className="list-disc list-inside mt-4 space-y-2">
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
                <ul className="list-disc list-inside mt-4 space-y-2">
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
                <ul className="list-disc list-inside mt-4 space-y-2">
                    <li>공장, 축산 시설 이전 및 철거 보상 소송</li>
                    <li>영업 손실 보상 및 휴업 보상 청구</li>
                    <li>특수 시설물 평가 및 보상 관련 자문</li>
                    <li>집단 민원 해결을 위한 협상 및 소송 대리</li>
                </ul>
            `
        }
    };

    // Data for case results details
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
                        color: "blue" // For gradient
                    },
                    {
                        heading: "지방도, 국지도 사업",
                        list: [
                            "남양주 덕송-내각 도로 건설공사, 오포-포곡간 도로 건설공사, 동두천-연천 전철화 공사, 부천-원종간 복선전철 공사, 가남-감곡 도로 확포장 공사, 평택 동부고속화도로 공사, 광주-원주1호선 건설공사, 대전동 181-6 - 1024-10번지 도로개설공사, 국지도 98호선 도로 - 심촌 도로건설공사 등 다수의 지방도, 국지도 사업"
                        ],
                        color: "green"
                    }
                ],
                [ // Page 2 (Updated with new content)
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

    const showPage = (pageId) => {
        setCurrentPage(pageId);
        // Reset all detail states when switching main pages
        setLawyerDetail(null);
        setPracticeAreaDetail(null);
        setCaseResultDetail(null);
        setMajorProjectsCurrentPageIndex(0); // Reset pagination for major projects and successful cases
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Function to handle showing lawyer detail page
    const handleShowLawyerDetail = (key) => {
        setLawyerDetail(lawyers[key]);
        setCurrentPage('lawyer-detail'); // Navigate to the lawyer detail page
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Function to handle hiding lawyer detail page and returning to 'about'
    const handleHideLawyerDetail = () => {
        setLawyerDetail(null);
        setCurrentPage('about'); // Return to the about page
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleShowPracticeAreaDetail = (key) => {
        setPracticeAreaDetail(practiceAreasData[key]);
    };

    const handleHidePracticeAreaDetail = () => {
        setPracticeAreaDetail(null);
    };

    const handleShowCaseResultDetail = (key) => {
        setCaseResultDetail(caseResultsData[key]);
        setMajorProjectsCurrentPageIndex(0); // Reset to first page when opening any case result detail
    };

    const handleHideCaseResultDetail = () => {
        setCaseResultDetail(null);
    };

    const explainLegalTerm = async () => {
        if (!legalTermInput.trim()) {
            setExplanationOutput('<p className="text-red-500">질문할 내용을 입력해 주세요.</p>');
            return;
        }

        setIsLoading(true);
        setExplanationOutput('<div className="spinner"></div> <p className="text-gray-600">답변을 생성 중입니다...</p>');

        try {
            let chatHistory = [];
            const prompt = `토지보상 및 수용 관련 질문에 대해 간결하고 이해하기 쉽게 설명해 주세요: "${legalTermInput}"`;
            chatHistory.push({ role: "user", parts: [{ text: prompt }] });

            const payload = { contents: chatHistory };
            const apiKey = ""; // Canvas will inject the API key at runtime
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                const text = result.candidates[0].content.parts[0].text;
                setExplanationOutput(`<p>${text}</p>`);
            } else {
                setExplanationOutput('<p className="text-red-500">답변을 생성하는 데 실패했습니다. 다시 시도해 주세요.</p>');
            }
        } catch (error) {
            console.error('Error calling Gemini API:', error);
            setExplanationOutput('<p className="text-red-500">오류가 발생했습니다: ' + error.message + '</p>');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // This effect will run once after the initial render to set the active nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            if (link.dataset.page === currentPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }, [currentPage]); // Re-run when currentPage changes

    // Helper for gradient colors
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

    return (
        <div className="flex flex-col min-h-screen">
            {/* Custom CSS for spinner animation and button styles */}
            <style>{`
                .spinner {
                  border: 4px solid rgba(0, 0, 0, 0.1);
                  border-left-color: #3b82f6; /* Blue color for spinner */
                  border-radius: 50%;
                  width: 24px;
                  height: 24px;
                  animation: spin 1s linear infinite;
                  margin-right: 8px; /* Space between spinner and text */
                }

                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }

                /* Animation for Hero text */
                @keyframes fade-grow-sparkle {
                    0% {
                        opacity: 0;
                        transform: scale(0.8);
                        text-shadow: 0 0 0 rgba(255, 255, 255, 0);
                    }
                    50% {
                        opacity: 1;
                        transform: scale(1.1);
                        text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
                    }
                    75% {
                        opacity: 1;
                        transform: scale(1);
                        text-shadow: 0 0 20px rgba(255, 255, 255, 0.8), 0 0 30px rgba(255, 255, 255, 0.6); /* Sparkle effect */
                    }
                    100% {
                        opacity: 1;
                        transform: scale(1);
                        text-shadow: 0 0 0 rgba(255, 255, 255, 0); /* Fade out sparkle */
                    }
                }
                .animate-fade-grow-sparkle {
                    animation: fade-grow-sparkle 3s ease-out forwards; /* 3 seconds total duration */
                }

                /* Professional Button Styles */
                .btn-primary {
                    @apply px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-full shadow-lg hover:shadow-xl transition duration-300 ease-in-out transform hover:-translate-y-1;
                    font-weight: 600;
                    letter-spacing: 0.05em;
                }
                .btn-secondary {
                    /* Changed background and text color for better visibility */
                    @apply px-6 py-3 bg-blue-800 text-white rounded-lg shadow-lg hover:bg-blue-900 transition duration-300 ease-in-out;
                    font-weight: 500;
                }
                /* Specific styles for pagination buttons to ensure white text */
                .pagination-button {
                    @apply text-white bg-gray-700 shadow-md hover:bg-gray-600; /* Added gray background and hover for shadow effect */
                }
                .pagination-button:disabled {
                    @apply bg-gray-800 text-gray-500 cursor-not-allowed shadow-inner; /* Darker background and lighter text for disabled */
                }
            `}</style>
            {/* Header */}
            <header className="bg-white shadow-md py-4 px-6 md:px-12 sticky top-0 z-50">
                <nav className="container mx-auto flex flex-col md:flex-row items-center justify-between">
                    {/* LAWTTO Logo */}
                    <div className="mb-4 md:mb-0">
                        <a href="#!" onClick={() => showPage('home')} className="flex items-center">
                            <LawttoLogo />
                        </a>
                    </div>
                    {/* Navigation Menu */}
                    <ul className="flex flex-wrap justify-center md:flex-nowrap md:space-x-8 text-lg">
                        <li><a href="#!" className="nav-link text-gray-700 hover:text-blue-600 py-2 px-3 rounded-md transition duration-300" data-page="home" onClick={() => showPage('home')}>홈</a></li>
                        <li><a href="#!" className="nav-link text-gray-700 hover:text-blue-600 py-2 px-3 rounded-md transition duration-300" data-page="about" onClick={() => showPage('about')}>법률사무소 소개</a></li>
                        <li><a href="#!" className="nav-link text-gray-700 hover:text-blue-600 py-2 px-3 rounded-md transition duration-300" data-page="practice-areas" onClick={() => showPage('practice-areas')}>전문분야</a></li>
                        <li><a href="#!" className="nav-link text-gray-700 hover:text-blue-600 py-2 px-3 rounded-md transition duration-300" data-page="case-results" onClick={() => showPage('case-results')}>업무실적</a></li>
                        <li><a href="#!" className="nav-link text-gray-700 hover:text-blue-600 py-2 px-3 rounded-md transition duration-300" data-page="news-articles" onClick={() => showPage('news-articles')}>뉴스&기사</a></li>
                        <li><a href="#!" className="nav-link text-gray-700 hover:text-blue-600 py-2 px-3 rounded-md transition duration-300" data-page="contact" onClick={() => showPage('contact')}>문의</a></li>
                    </ul>
                </nav>
            </header>

            {/* Main Content Area */}
            <main className="flex-grow bg-gray-50"> {/* Static light gray background */}
                {currentPage === 'home' && (
                    <>
                    {/* Hero Section */}
                    <section id="hero-main" className="relative h-[80vh] flex items-start justify-center text-center text-white overflow-hidden bg-black">
                        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://www.dropbox.com/scl/fi/i6q410z2s137452123/1.png?rlkey=v8106p1j4z3w789123&raw=1')" }}></div>
                        <div className="absolute inset-0 bg-black opacity-60"></div>
                        <div className="relative z-10 max-w-4xl mx-auto px-6 pt-24 pb-6 rounded-xl">
                            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6 animate-fade-grow-sparkle">
                                <span className="block">토지보상, 아는 만큼 받습니다</span>
                            </h1>
                            <p className="text-lg md:text-xl font-light mb-10 opacity-90">
                                법률사무소 LAWTTO는 토지보상 및 수용분야의 독보적인 전문성으로<br />
                                의뢰인의 최대 권리와 보상금을 추구합니다.
                            </p>
                        </div>
                    </section>

                    {/* Home Section - Info Links */}
                    <section id="info-links" className="bg-gray-900 py-16 px-6 md:px-12 rounded-xl shadow-lg mb-8 mx-auto container -mt-64 relative z-20">
                        <h3 className="text-3xl font-bold text-white mb-10 text-center">LAWTTO의 다양한 소식과 정보를 만나세요</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* First box - Reverted to original state (SVG icon, no img) */}
                            <a href="https://www.youtube.com/@LAWTTOTV-de4ss" target="_blank" rel="noopener noreferrer" className="block">
                                <div className="p-6 rounded-lg shadow-md flex flex-col items-center justify-center bg-gray-800 hover:shadow-xl transition duration-300 h-full">
                                    {/* YouTube Icon (SVG) */}
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" className="w-16 h-16 text-red-500 mr-4">
                                        <path fill="currentColor" d="M549.655 124.083c-6.281-23.65-24.787-42.18-48.437-48.461C458.665 64 288 64 288 64S117.335 64 74.787 75.622c-23.65 6.281-42.18 24.787-48.461 48.437C16 165.335 16 256 16 256s0 90.665 11.622 133.213c6.281 23.65 24.787 42.18 48.437 48.461C117.335 448 288 448 288 448s170.665 0 213.213-11.622c23.65-6.281 42.18-24.787 48.461-48.437C560 346.665 560 256 560 256s0-90.665-10.345-131.917zM229.06 354.936V157.064L384 256l-154.94 98.936z"/>
                                    </svg>
                                    <p className="text-white font-semibold text-xl">Lawtto TV</p>
                                    <p className="text-gray-300 text-md">토지보상 전문채널</p>
                                </div>
                            </a>
                            {/* Second box - Remains unchanged as it was correct */}
                            <a href="https://www.youtube.com/@토지보상실무연구회" target="_blank" rel="noopener noreferrer" className="block">
                                <div className="p-6 rounded-lg shadow-md flex flex-col items-center justify-center bg-gray-800 hover:shadow-xl transition duration-300 h-full">
                                    <div className="flex items-center mb-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" className="w-16 h-16 text-red-500 mr-4">
                                            <path fill="currentColor" d="M549.655 124.083c-6.281-23.65-24.787-42.18-48.437-48.461C458.665 64 288 64 288 64S117.335 64 74.787 75.622c-23.65 6.281-42.18 24.787-48.461 48.437C16 165.335 16 256 16 256s0 90.665 11.622 133.213c6.281 23.65 24.787 42.18 48.437 48.461C117.335 448 288 448 288 448s170.665 0 213.213-11.622c23.65-6.281 42.18-24.787 48.461-48.437C560 346.665 560 256 560 256s0-90.665-10.345-131.917zM229.06 354.936V157.064L384 256l-154.94 98.936z"/>
                                        </svg>
                                        <div className="flex flex-col items-start"> {/* This div will hold the two lines */}
                                            <p className="text-white font-semibold text-xl leading-tight">토지보상</p> {/* text-xl for larger */}
                                            <p className="text-white font-semibold text-lg leading-tight">실무연구회</p> {/* text-lg for slightly smaller */}
                                        </div>
                                    </div>
                                    <p className="text-gray-300 text-md">보상실무 전문가 채널</p>
                                </div>
                            </a>
                            {/* Third box - Phone Number with "상담/문의" text - Now clickable to Contact page */}
                            <div className="p-6 rounded-lg shadow-md flex flex-col items-center justify-center text-center bg-gray-800 h-full cursor-pointer hover:shadow-xl transition duration-300"
                                 onClick={() => showPage('contact')}>
                                {/* Removed the SVG phone icon */}
                                <div className="text-blue-400 text-4xl font-bold mb-2">상담/문의</div> {/* Large "상담/문의" text */}
                                <p className="text-white font-semibold text-2xl">02-592-9657</p> {/* Increased font size to text-2xl */}
                            </div>
                            {/* Fourth box - Lawtto News Text Design */}
                            <div className="p-6 rounded-lg shadow-md flex flex-col items-center justify-center text-center bg-gray-800 h-full cursor-pointer hover:shadow-xl transition duration-300"
                                 onClick={() => showPage('news-articles')}>
                                <div className="flex flex-col items-center mb-4">
                                    {/* Adjusted font sizes to make widths more similar */}
                                    <p className="text-white font-extrabold text-3xl bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent leading-none">로우토</p>
                                    <p className="text-white font-bold text-4xl bg-gradient-to-r from-blue-300 to-cyan-200 bg-clip-text text-transparent leading-none">뉴-스</p>
                                </div>
                                <p className="text-gray-300 text-md">언론 보도, 기사</p> {/* text-md for size similar to first two boxes */}
                            </div>
                        </div>
                    </section>
                    </>
                )}

                {/* About Law Firm Section (법률사무소 소개) */}
                {currentPage === 'about' && (
                    <section id="about" className="content-section active bg-gray-900 p-8 rounded-xl shadow-lg mb-8 container mx-auto"> {/* Changed bg-white to bg-gray-900 */}
                        <h2 className="text-3xl font-bold text-white mb-6 border-b-2 pb-3 border-blue-300">법률사무소 LAWTTO 소개</h2> {/* Changed text-gray-900 to text-white, border-blue-600 to border-blue-300 */}

                        <div className="bg-gray-800 p-8 rounded-xl shadow-inner mb-10"> {/* New div for content with bg-gray-800 */}
                            {/* Founding Purpose */}
                            <div className="mb-10">
                                <h3 className="text-2xl font-semibold text-blue-300 mb-4">설립 취지</h3> {/* Changed text-blue-700 to text-blue-300 */}
                                <p className="text-gray-300 leading-relaxed text-lg"> {/* Changed text-gray-700 to text-gray-300 */}
                                    법률사무소 LAWTTO는 설립 당시, 국가 등 사업시행자의 일방적인 사업 진행으로 인해 지식과 경험 부족으로 권리 침해에 적절히 대응하지 못하는 토지 소유자들의 어려움에 깊이 공감하였습니다. 또한, 보상 실무 현장에서 전문성을 갖춘 변호사 등 전문 인력의 부재와 잘못된 정보 및 오해로 인한 혼선이 가중되어 투명하고 정당한 보상 관행을 기대하기 어려운 상황을 개선하고자 설립되었습니다.
                                </p>
                                <p className="text-gray-300 leading-relaxed text-lg mt-4"> {/* Changed text-gray-700 to text-gray-300 */}
                                    저희는 이러한 문제의식 아래, 토지 및 수용 분야에 대한 심도 깊은 연구를 지속하고 관련 연구회 활동을 통해 실무에 적용 가능한 학문적 성과들을 체계적으로 정리해 왔습니다. 이를 바탕으로 독보적인 전문성을 확보하여 토지 보상 현장에서 의뢰인의 최대 권익을 보호하고, 투명하고 공정한 보상이 이루어지도록 끊임없이 노력하고 있습니다.
                                </p>
                            </div>

                            {/* Lawyers Introduction */}
                            <div className="mb-10"> {/* Added mb-10 for spacing before the new section */}
                                <h3 className="text-2xl font-semibold text-blue-300 mb-6">변호사 소개</h3> {/* Changed text-blue-700 to text-blue-300 */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Lawyer 1: Ryu Chang-yong */}
                                    <div className="bg-gray-700 p-6 rounded-lg shadow-md flex flex-col items-center text-center"> {/* Changed bg-gray-100 to bg-gray-700 */}
                                        <img src="https://search.pstatic.net/common?type=b&size=3000&quality=100&direct=true&src=http%3A%2F%2Fsstatic.naver.net%2Fpeople%2F20%2F201303051606532411.jpg" alt="류창용 변호사 사진" className="w-36 h-36 rounded-full object-cover mb-4 border-4 border-blue-300" />
                                        <h4 className="text-xl font-bold text-white">류창용 변호사</h4> {/* Changed text-gray-800 to text-white */}
                                        <p className="text-md text-gray-300 mb-3">대표 변호사</p> {/* Changed text-gray-600 to text-gray-300 */}
                                        <button className="btn-secondary" onClick={() => handleShowLawyerDetail('ryu')}>자세히 보기</button>
                                    
                                    </div>

                                    {/* Lawyer 2: Yoo Dong-hyun */}
                                    <div className="bg-gray-700 p-6 rounded-lg shadow-md flex flex-col items-center text-center"> {/* Changed bg-gray-100 to bg-gray-700 */}
                                        <img src="https://placehold.co/150x150/e0e7ff/3b82f6?text=변호사+사진" alt="유동현 변호사 사진" className="w-36 h-36 rounded-full object-cover mb-4 border-4 border-blue-300" />
                                        <h4 className="text-xl font-bold text-white">유동현 변호사</h4> {/* Changed text-gray-800 to text-white */}
                                        <p className="text-md text-gray-300 mb-3">소속 변호사</p> {/* Changed text-gray-600 to text-gray-300 */}
                                        <button className="btn-secondary" onClick={() => handleShowLawyerDetail('yoo')}>자세히 보기</button>
                                    </div>
                                </div>
                            </div>

                            {/* LAWTTO 협업 및 자문기관 Section - NEW SUB-SECTION */}
                            <div>
                                <h3 className="text-2xl font-semibold text-blue-300 mb-6">LAWTTO 협업 및 자문기관</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                                    {/* Box 1 */}
                                    <a href="https://cafe.naver.com/kalecl/48" target="_blank" rel="noopener noreferrer" className="block">
                                        <div className="bg-gray-700 p-4 rounded-lg shadow-md hover:shadow-xl transition duration-300 flex flex-col items-center text-center h-full"> {/* Added h-full to make boxes the same height */}
                                            {/* Icon for research/book */}
                                            <svg className="w-16 h-16 text-indigo-400 mb-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M21 5c-1.11-.35-2.3-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 5.5 1 6v14c1.1-.35 2.29-.5 3.5-.5 1.95 0 4.05.4 5.5 1.5 1.45-1.1 3.55-1.5 5.5-1.5s4.05.4 5.5 1.5V5zm-2 14c-1.1-.35-2.29-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5V6c1.1-.35 2.29-.5 3.5-.5 1.95 0 4.05.4 5.5 1.5v13z"/>
                                            </svg>
                                            <h4 className="text-lg font-semibold text-white mb-1">(사)한국토지보상법연구</h4>
                                            <p className="text-gray-300 text-xs">토지보상법 연구 및 실무</p> {/* Added a placeholder description */}
                                        </div>
                                    </a>
                                    {/* Box 2 */}
                                    <a href="https://www.msapp.co.kr/" target="_blank" rel="noopener noreferrer" className="block">
                                        <div className="p-6 rounded-lg shadow-md flex flex-col items-center justify-center text-center bg-gray-800 hover:shadow-xl transition duration-300 h-full">
                                            {/* Placeholder for an icon or image related to appraisal */}
                                            <svg className="w-16 h-16 text-blue-400 mb-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                                            </svg>
                                            <h4 className="text-lg font-semibold text-white mb-1">(주)미래새한감정평가법인</h4>
                                            <p className="text-gray-300 text-xs">감정평가 및 보상 컨설팅</p>
                                        </div>
                                    </a>
                                    {/* Box 3 - Updated as per request */}
                                    <a href="https://www.sekyoung.net/" target="_blank" rel="noopener noreferrer" className="block">
                                        <div className="bg-gray-700 p-4 rounded-lg shadow-md hover:shadow-xl transition duration-300 flex flex-col items-center text-center h-full">
                                            {/* Icon for appraisal firm - using a simple building/document icon */}
                                            <svg className="w-16 h-16 text-green-400 mb-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M19 12h-2V8h-2v4h-2v4h-2v-4h-2v4H9V8H7v4H5V8H3v12h18V8h-2v4zM12 2L1 6v2h22V6L12 2z"/>
                                            </svg>
                                            <h4 className="text-lg font-semibold text-white mb-1">세경평가법인(주)</h4>
                                            <p className="text-gray-300 text-xs">부동산 감정평가 및 컨설팅</p>
                                        </div>
                                    </a>
                                    {/* Box 4 - Updated as per request */}
                                    <a href="https://www.blog.naver.com/pekary" target="_blank" rel="noopener noreferrer" className="block">
                                        <div className="bg-gray-700 p-4 rounded-lg shadow-md hover:shadow-xl transition duration-300 flex flex-col items-center text-center h-full">
                                            {/* Icon for law firm - using a simple justice scale icon */}
                                            <svg className="w-16 h-16 text-purple-400 mb-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M21 17h-2v-4h-2v4h-2v-4h-2v4h-2v-4H9v4H7v-4H5v4H3v-4H1v8h22v-8h-2zm-10 0H7v-4h4v4zm6 0h-4v-4h4v4zm6 0h-4v-4h4v4zM12 2L1 6v2h22V6L12 2z"/>
                                            </svg>
                                            <h4 className="text-lg font-semibold text-white mb-1">법률사무소 강변</h4>
                                            <p className="text-gray-300 text-xs">부동산 전문 법률 자문</p>
                                        </div>
                                    </a>
                                    {/* Box 5 - Updated as per request */}
                                    <div className="bg-gray-700 p-4 rounded-lg shadow-md flex flex-col items-center text-center h-full">
                                        {/* Icon for tax firm - using a simple document/chart icon */}
                                        <svg className="w-16 h-16 text-orange-400 mb-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                                        </svg>
                                        <h4 className="text-lg font-semibold text-white mb-1">세무법인 네오텍스</h4>
                                        <p className="text-gray-300 text-xs">세무 자문 및 회계 서비스</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* Lawyer Detail Page Section */}
                {currentPage === 'lawyer-detail' && lawyerDetail && (
                    <section id="lawyer-detail-page" className="content-section active bg-gray-900 p-8 rounded-xl shadow-lg mb-8 container mx-auto"> {/* Changed bg-white to bg-gray-900 */}
                        <h2 className="text-3xl font-bold text-white mb-6 border-b-2 pb-3 border-blue-300">{lawyerDetail.name}</h2> {/* Changed text-gray-900 to text-white, border-blue-600 to border-blue-300 */}
                        <div className="text-gray-300 leading-relaxed text-lg" dangerouslySetInnerHTML={{ __html: lawyerDetail.content }}></div> {/* Changed text-gray-800 to text-gray-300 */}
                        <button className="mt-8 btn-secondary" onClick={handleHideLawyerDetail}>목록으로 돌아가기</button>
                    </section>
                )}

                {/* Practice Areas Section (전문분야) */}
                {currentPage === 'practice-areas' && (
                    <section id="practice-areas" className="content-section active bg-gray-900 p-8 rounded-xl shadow-lg mb-8 container mx-auto"> {/* Changed bg-white to bg-gray-900 */}
                        <h2 className="text-3xl font-bold text-white mb-6 border-b-2 pb-3 border-blue-300">전문 분야</h2> {/* Changed text-gray-900 to text-white, border-blue-600 to border-blue-300 */}
                        <div className="bg-gray-800 p-8 rounded-xl shadow-inner"> {/* New div for content with bg-gray-800 */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="bg-gray-700 p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300"> {/* Changed bg-gray-100 to bg-gray-700 */}
                                    <h3 className="text-xl font-semibold text-blue-300 mb-3">토지 보상 및 수용 사건 일반</h3> {/* Changed text-blue-700 to text-blue-300 */}
                                    <p className="text-gray-300 text-sm mb-4">수용재결, 이의재결, 보상금증액소송 등</p> {/* Changed text-gray-700 to text-gray-300 */}
                                    <button className="btn-secondary" onClick={() => handleShowPracticeAreaDetail('area1')}>자세히 보기</button>
                                </div>
                                <div className="bg-gray-700 p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300"> {/* Changed bg-gray-100 to bg-gray-700 */}
                                    <h3 className="text-xl font-semibold text-blue-300 mb-3">도로, 철도사업 관련 민원 및 소송</h3> {/* Changed text-blue-700 to text-blue-300 */}
                                    <p className="text-gray-300 text-sm mb-4">잔여지 및 설계 관련</p> {/* Changed text-gray-700 to text-gray-300 */}
                                    <button className="btn-secondary" onClick={() => handleShowPracticeAreaDetail('area2')}>자세히 보기</button>
                                </div>
                                <div className="bg-gray-700 p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300"> {/* Changed bg-gray-100 to bg-gray-700 */}
                                    <h3 className="text-xl font-semibold text-blue-300 mb-3">장기미집행 도시계획시설(공원) 관련 민원 및 소송</h3> {/* Changed text-blue-700 to text-blue-300 */}
                                    <p className="text-gray-300 text-sm mb-4">미집행 도시계획시설 관련 법률 자문 및 소송</p> {/* Changed text-gray-700 to text-gray-300 */}
                                    <button className="btn-secondary" onClick={() => handleShowPracticeAreaDetail('area3')}>자세히 보기</button>
                                </div>
                                <div className="bg-gray-700 p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300"> {/* Changed bg-gray-100 to bg-gray-700 */}
                                    <h3 className="text-xl font-semibold text-blue-300 mb-3">행정계획 등과 관련된 민원 및 소송</h3> {/* Changed text-blue-700 to text-blue-300 */}
                                    <p className="text-300 text-sm mb-4">국민권익위 고충민원 등 행정 절차 및 소송</p> {/* Changed text-gray-700 to text-gray-300 */}
                                    <button className="btn-secondary" onClick={() => handleShowPracticeAreaDetail('area4')}>자세히 보기</button>
                                </div>
                                <div className="bg-gray-700 p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300"> {/* Changed bg-gray-100 to bg-gray-700 */}
                                    <h3 className="text-xl font-semibold text-blue-300 mb-3">공장, 축산 등 특수분야 집단민원 및 소송</h3> {/* Changed bg-gray-700 to bg-gray-300 */}
                                    <p className="text-gray-300 text-sm mb-4">특수 산업 분야의 집단 민원 및 법적 대응</p> {/* Changed text-gray-700 to text-gray-300 */}
                                    <button className="btn-secondary" onClick={() => handleShowPracticeAreaDetail('area5')}>자세히 보기</button>
                                </div>
                            </div>
                        </div>
                        {/* Practice Area Detail Section */}
                        {practiceAreaDetail && (
                            <div id="practice-area-detail" className="mt-10 p-8 bg-gray-800 rounded-xl shadow-inner"> {/* Changed bg-gray-100 to bg-gray-800 */}
                                <h3 className="text-2xl font-bold text-blue-300 mb-4">{practiceAreaDetail.title}</h3> {/* Changed text-blue-800 to text-blue-300 */}
                                <div className="text-gray-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: practiceAreaDetail.content }}></div> {/* Changed text-gray-800 to text-gray-300 */}
                                <button className="mt-6 btn-secondary" onClick={handleHidePracticeAreaDetail}>목록으로 돌아가기</button>
                            </div>
                        )}
                    </section>
                )}

                {/* Case Results Section (업무실적) */}
                {currentPage === 'case-results' && (
                    <section id="case-results" className="content-section active bg-gray-900 p-8 rounded-xl shadow-lg mb-8 container mx-auto"> {/* Changed bg-white to bg-gray-900 */}
                        <h2 className="text-3xl font-bold text-white mb-6 border-b-2 pb-3 border-blue-300">업무 실적</h2> {/* Changed text-gray-900 to text-white, border-blue-600 to border-blue-300 */}
                        <div className="bg-gray-800 p-8 rounded-xl shadow-inner"> {/* New div for content with bg-gray-800 */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-gray-700 p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300"> {/* Changed bg-gray-100 to bg-gray-700 */}
                                    <h3 className="text-xl font-semibold text-blue-300 mb-3">업무 수행 주요 사업</h3> {/* Changed text-blue-700 to text-blue-300 */}
                                    <p className="text-gray-300 text-sm mb-4">LAWTTO가 수행한 주요 프로젝트 목록입니다.</p> {/* Changed text-gray-700 to text-gray-300 */}
                                    <button className="btn-secondary" onClick={() => handleShowCaseResultDetail('major-projects')}>자세히 보기</button>
                                </div>
                                <div className="bg-gray-700 p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300"> {/* Changed bg-gray-100 to bg-gray-700 */}
                                    <h3 className="text-xl font-semibold text-blue-300 mb-3">주요 업무 성공 사례</h3> {/* Changed text-blue-700 to text-blue-300 */}
                                    <p className="text-gray-300 text-sm mb-4">LAWTTO의 성공적인 사건 해결 사례를 소개합니다.</p> {/* Changed text-gray-700 to text-gray-300 */}
                                    <button className="btn-secondary" onClick={() => handleShowCaseResultDetail('successful-cases')}>자세히 보기</button>
                                </div>
                            </div>
                        </div>
                        {/* Case Result Detail Section */}
                        {caseResultDetail && (
                            <div id="case-result-detail" className="mt-10 p-8 bg-gray-800 rounded-xl shadow-inner"> {/* Changed bg-gray-100 to bg-gray-800 */}
                                <h3 className="text-2xl font-bold text-blue-300 mb-4">{caseResultDetail.title}</h3> {/* Changed text-blue-800 to text-blue-300 */}
                                {caseResultDetail.pages ? (
                                    <>
                                        <div className="space-y-6">
                                            {caseResultDetail.pages[majorProjectsCurrentPageIndex].map((item, index) => (
                                                <div key={index}>
                                                    <h4 className={`inline-block px-3 py-1 bg-gradient-to-r ${getGradientClass(item.color)} text-white font-semibold rounded-full shadow-md`}>{item.heading}</h4>
                                                    <ul className="list-disc list-inside ml-4 mt-2 space-y-1 text-gray-300">
                                                        {item.list.map((listItem, liIndex) => (
                                                            <li key={liIndex}>{listItem}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex justify-between mt-8">
                                            <button
                                                className="pagination-button px-6 py-3 rounded-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                onClick={() => setMajorProjectsCurrentPageIndex(prev => Math.max(0, prev - 1))}
                                                disabled={majorProjectsCurrentPageIndex === 0}
                                            >
                                                이전
                                            </button>
                                            <span className="text-gray-300 text-lg">
                                                {majorProjectsCurrentPageIndex + 1} / {caseResultDetail.pages.length}
                                            </span>
                                            <button
                                                className="pagination-button px-6 py-3 rounded-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                onClick={() => setMajorProjectsCurrentPageIndex(prev => Math.min(caseResultDetail.pages.length - 1, prev + 1))}
                                                disabled={majorProjectsCurrentPageIndex === caseResultDetail.pages.length - 1}
                                            >
                                                다음
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-gray-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: caseResultDetail.content }}></div>
                                )}
                                <button className="mt-6 btn-secondary" onClick={handleHideCaseResultDetail}>목록으로 돌아가기</button>
                            </div>
                        )}
                    </section>
                )}

                {/* News & Articles Section (뉴스&기사) */}
                {currentPage === 'news-articles' && (
                    <section id="news-articles" className="content-section active bg-gray-900 p-8 rounded-xl shadow-lg mb-8 container mx-auto">
                        <h2 className="text-3xl font-bold text-white mb-6 border-b-2 pb-3 border-blue-300">뉴스 & 기사</h2>
                        <div className="overflow-x-auto bg-gray-800 p-8 rounded-xl shadow-inner"> {/* Added bg-gray-800 and shadow-inner */}
                            <table className="min-w-full rounded-lg shadow-md">
                                <thead>
                                    <tr className="bg-gray-700 text-left text-white uppercase text-sm leading-normal">
                                        <th className="py-3 px-6 text-left rounded-tl-lg">제목</th>
                                        <th className="py-3 px-6 text-left rounded-tr-lg">관련 링크</th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-300 text-lg">
                                    <tr className="border-b border-gray-700 hover:bg-gray-700 transition duration-300">
                                        <td className="py-4 px-6">
                                            <span className="bg-gray-700 p-1 rounded text-gray-200">Lawtto 자문 세종스마트국가산단 주민대책위 소식:</span><br />
                                            축산벨트 집단폐업보상 관련 권익위 부위원장 와촌리 방문(2507)
                                        </td>
                                        <td className="py-4 px-6"><a href="https://www.sisatoday.co.kr/amp/1065621964701726" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">시사투데이 기사보기</a></td>
                                    </tr>
                                    <tr className="border-b border-gray-700 hover:bg-gray-700 transition duration-300">
                                        <td className="py-4 px-6">
                                            <span className="bg-gray-700 p-1 rounded text-gray-200">Lawtto 자문 세종스마트국가산단 주민대책위 소식:</span><br />
                                            농민 공익직불금 지급 국민권익위 의견표명(2410)
                                        </td>
                                        <td className="py-4 px-6"><a href="https://www.m-i.kr/news/articleView.html?idxno=1167363" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">매일일보 기사보기</a></td>
                                    </tr>
                                    <tr className="border-b border-gray-700 hover:bg-gray-700 transition duration-300">
                                        <td className="py-4 px-6">
                                            <span className="bg-gray-700 p-1 rounded text-gray-200">Lawtto 자문 세종스마트국가산단 주민대책위 소식:</span><br />
                                            세종시, 산단 편입지역 재산세 감면 연내 시행(2409)
                                        </td>
                                        <td className="py-4 px-6"><a href="https://cc.newdaily.co.kr/site/data/html/2024/09/13/2024091300005.html" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">뉴데일리 충청*세종 기사보기</a></td>
                                    </tr>
                                    {/* Existing new entry */}
                                    <tr className="border-b border-gray-700 hover:bg-gray-700 transition duration-300">
                                        <td className="py-4 px-6">
                                            <span className="bg-gray-700 p-1 rounded text-gray-200">LAWTTO 대표변호사 칼럼:</span><br />
                                            [전문분야이야기] 도시공원 일몰제 시행 5년의 단상(2502)
                                        </td>
                                        <td className="py-4 px-6"><a href="https://news.koreanbar.or.kr/news/articleView.html?idxno=32742" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">법조신문 칼럼보기</a></td>
                                    </tr>
                                    {/* New entry added here */}
                                    <tr className="border-b border-gray-700 hover:bg-gray-700 transition duration-300">
                                        <td className="py-4 px-6">
                                            <span className="bg-gray-700 p-1 rounded text-gray-200">LAWTTO 대표변호사 칼럼:</span><br />
                                            [전문분야이야기] 대규모 공익사업지구 토지소유자 추천 감정평가사 선정절차에 대한 소고(2411)
                                        </td>
                                        <td className="py-4 px-6"><a href="https://news.koreanbar.or.kr/news/articleView.html?idxno=32014" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">법조신문 칼럼보기</a></td>
                                    </tr>
                                    {/* New entry for 6th row */}
                                    <tr className="border-b border-gray-700 hover:bg-gray-700 transition duration-300">
                                        <td className="py-4 px-6">
                                            <span className="bg-gray-700 p-1 rounded text-gray-200">LAWTTO 대표변호사 칼럼:</span><br />
                                            [전문분야이야기] 중앙토지수용위원회 공익성 협의 제도에 관한 논의(2404)
                                        </td>
                                        <td className="py-4 px-6"><a href="https://news.koreanbar.or.kr/news/articleView.html?idxno=30561" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">법조신문 칼럼보기</a></td>
                                    </tr>
                                    {/* New entry for 7th row */}
                                    <tr className="border-b border-gray-700 hover:bg-gray-700 transition duration-300">
                                        <td className="py-4 px-6">
                                            <span className="bg-gray-700 p-1 rounded text-gray-200">LAWTTO 유동현 변호사 언론 인터뷰:</span><br />
                                            보상금 한푼 없이 세입자 쫓아내는 공영개발...권익위 권고도 무시(2203)
                                        </td>
                                        <td className="py-4 px-6"><a href="https://www.moneys.co.kr/article/2022022817138087520" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">머니S 기사보기</a></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}

                {/* Contact Section (문의) */}
                {currentPage === 'contact' && (
                    <section id="contact" className="content-section active bg-gray-900 p-8 rounded-xl shadow-lg mb-8 container mx-auto">
                        <h2 className="text-3xl font-bold text-white mb-6 border-b-2 pb-3 border-blue-300">문의</h2>
                        <div className="flex flex-col md:flex-row gap-8 md:items-stretch"> {/* Added md:items-stretch */}
                            {/* Left Half: Contact Info */}
                            <div className="md:w-1/2 space-y-6 p-6 bg-gray-800 rounded-xl shadow-lg flex flex-col"> {/* Added flex flex-col */}
                                <h3 className="text-2xl font-bold text-blue-300 mb-4">법률사무소 LAWTTO에 문의하세요</h3>
                                <p className="text-gray-300 leading-relaxed text-lg flex-grow"> {/* Added flex-grow */}
                                    토지보상 및 수용 관련하여 궁금한 점이 있으시면 언제든지 연락 주십시오.
                                    전문 변호사가 친절하고 상세하게 상담해 드립니다.
                                </p>

                                <div className="space-y-3 text-lg">
                                    <p className="text-gray-300"><strong className="text-blue-300">대표전화:</strong> 02-592-9657</p>
                                    <p className="text-gray-300"><strong className="text-blue-300">팩스:</strong> 02-6020-9729</p>
                                    <p className="text-gray-300"><strong className="text-blue-300">이메일:</strong> solomon114@naver.com</p>
                                    <p className="text-gray-300"><strong className="text-blue-300">주소:</strong> 서울특별시 영등포구 국회대로76길 33 중앙보훈회관 502호</p>
                                </div>
                                {/* Image added here */}
                                <img
                                    src="https://www.dropbox.com/scl/fi/ls8ujbux667kefw526mwi/2.png?rlkey=pozvzpzqmqvn6ml5c724ltyjs&raw=1"
                                    alt="법률사무소 LAWTTO 사무실 건물 외관"
                                    className="mt-6 w-full rounded-lg shadow-lg border border-gray-200"
                                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/cccccc/333333?text=이미지+로드+실패'; }}
                                />
                            </div>

                            {/* Right Half: AI Legal Assistant */}
                            <div className="md:w-1/2 space-y-6 p-6 bg-gray-800 rounded-xl shadow-lg flex flex-col"> {/* Removed justify-center, added flex-grow to children */}
                                <h3 className="text-2xl font-bold text-blue-300 mb-4 text-center">AI 법률 도우미</h3>
                                <p className="text-gray-300 leading-relaxed text-lg text-center mb-6">
                                    토지보상 및 수용에 관한 궁금증에 대해 질문하시면 AI가 답변해 드립니다.
                                    간단한 법률 용어 설명부터 복잡한 문제에 대한 일반적인 정보까지 도움을 드릴 수 있습니다.
                                </p>
                                <div className="flex flex-col gap-4 flex-grow"> {/* Added flex-grow to this div */}
                                    {/* Increased min-h */}
                                    <textarea
                                        id="legalTermInput"
                                        placeholder="질문을 입력해 주세요 (예: 수용재결이란 무엇인가요?)"
                                        className="flex-grow p-3 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring-blue-500 bg-gray-700 text-gray-200 min-h-[150px]"
                                        value={legalTermInput}
                                        onChange={(e) => setLegalTermInput(e.target.value)}
                                        disabled={isLoading}
                                    ></textarea>
                                    <button
                                        id="explainButton"
                                        className="btn-primary flex items-center justify-center w-full"
                                        onClick={explainLegalTerm}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <span className="spinner"></span>
                                                <span>답변 생성 중...</span>
                                            </>
                                        ) : (
                                            <span>AI에게 질문하기</span>
                                        )}
                                    </button>
                                </div>
                                {/* Increased min-h */}
                                <div
                                    id="explanationOutput"
                                    className="bg-gray-700 p-6 rounded-lg shadow-inner min-h-[200px] flex items-center justify-center text-gray-200 text-lg leading-relaxed overflow-auto mt-6"
                                    dangerouslySetInnerHTML={{ __html: explanationOutput }}
                                ></div>
                            </div>
                        </div>
                    </section>
                )}
            </main>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-6 px-6 md:px-12 mt-auto">
                <div className="container mx-auto text-center text-sm">
                    <p>&copy; {new Date().getFullYear()} 법률사무소 LAWTTO. All rights reserved.</p>
                    <p className="mt-2">대표자: 류창용 | 주소: 서울특별시 영등등포구 국회대로76길33 중앙보훈회관 502호 | 대표전화: 02-592-9657 | 팩스: 02-6020-9729</p>
                </div>
            </footer>
        </div>
    );
};

export default App;
