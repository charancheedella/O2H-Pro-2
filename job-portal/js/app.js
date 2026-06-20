document.addEventListener('DOMContentLoaded', () => {
    
    const themeToggleBtn = document.getElementById('theme-toggle');
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mainNav = document.getElementById('main-nav');
    
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const locationFilter = document.getElementById('location-filter');
    const companyFilter = document.getElementById('company-filter');
    
    const jobsGrid = document.getElementById('jobs-grid');
    const resultsCount = document.getElementById('results-count');
    const paginationNav = document.getElementById('pagination');
    const pageNumbers = document.getElementById('page-numbers');
    const prevPageBtn = document.getElementById('prev-page');
    const nextPageBtn = document.getElementById('next-page');
    
    const errorState = document.getElementById('error-state');
    const retryBtn = document.getElementById('retry-btn');
    const emptyState = document.getElementById('empty-state');
    const clearFiltersBtn = document.getElementById('clear-filters-btn');

    let allJobs = [];
    let filteredJobs = [];
    let currentPage = 1;
    const jobsPerPage = 6;
    
    const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Remote'];
    const experienceLevels = ['Entry Level', 'Mid Level', 'Senior', 'Lead'];

    // theme toggling
    const initTheme = () => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    };

    const toggleTheme = () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    };

    const updateThemeIcon = (theme) => {
        if (theme === 'dark') {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        } else {
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
        }
    };

    themeToggleBtn.addEventListener('click', toggleTheme);
    initTheme();

    // mobile nav behavior
    mobileMenuBtn.addEventListener('click', () => {
        const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
        mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
        mobileMenuBtn.classList.toggle('active');
        mainNav.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
        if (!mainNav.contains(e.target) && !mobileMenuBtn.contains(e.target) && mainNav.classList.contains('active')) {
            mobileMenuBtn.classList.remove('active');
            mainNav.classList.remove('active');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
        }
    });

    // nav link active states
    const navLinks = document.querySelectorAll('.nav-list a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            navLinks.forEach(nav => nav.classList.remove('active'));
            e.target.classList.add('active');
            
            if (mainNav.classList.contains('active')) {
                mobileMenuBtn.classList.remove('active');
                mainNav.classList.remove('active');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // fetch jobs from mock api
    const fetchJobs = async () => {
        showSkeletons();
        hideStates();
        
        try {
            const response = await fetch('https://dummyjson.com/users?limit=40');
            if (!response.ok) throw new Error('Network response was not ok');
            
            const data = await response.json();
            
            allJobs = data.users.map(user => {
                const type = jobTypes[user.id % jobTypes.length];
                const exp = experienceLevels[(user.id + 1) % experienceLevels.length];
                const salary = `$${(Math.floor(Math.random() * 80) + 60)},000 - $${(Math.floor(Math.random() * 80) + 140)},000`;
                
                return {
                    id: user.id,
                    title: user.company.title,
                    company: user.company.name,
                    location: user.address.city,
                    department: user.company.department,
                    type: type,
                    experience: exp,
                    salary: salary,
                    description: `Join our team at ${user.company.name} as a ${user.company.title}. We are looking for talented individuals who are passionate about ${user.company.department.toLowerCase()} and want to make a significant impact.`
                };
            });

            filteredJobs = [...allJobs];
            currentPage = 1;
            renderJobs();
        } catch (error) {
            console.error('Failed to load jobs:', error);
            showErrorState();
        }
    };

    const showSkeletons = () => {
        jobsGrid.innerHTML = '';
        for (let i = 0; i < jobsPerPage; i++) {
            const skeleton = document.createElement('div');
            skeleton.className = 'skeleton-card';
            skeleton.innerHTML = `
                <div class="skeleton-title shimmer"></div>
                <div class="skeleton-subtitle shimmer"></div>
                <div class="skeleton-tags">
                    <div class="skeleton-tag shimmer"></div>
                    <div class="skeleton-tag shimmer"></div>
                    <div class="skeleton-tag shimmer"></div>
                </div>
                <div class="skeleton-desc shimmer"></div>
                <div class="skeleton-desc-2 shimmer"></div>
                <div class="skeleton-footer">
                    <div class="skeleton-subtitle shimmer" style="width: 30%; margin:0;"></div>
                    <div class="skeleton-btn shimmer"></div>
                </div>
            `;
            jobsGrid.appendChild(skeleton);
        }
        paginationNav.classList.add('hidden');
    };

    const hideStates = () => {
        errorState.classList.add('hidden');
        emptyState.classList.add('hidden');
        jobsGrid.classList.remove('hidden');
    };

    const showErrorState = () => {
        jobsGrid.classList.add('hidden');
        paginationNav.classList.add('hidden');
        emptyState.classList.add('hidden');
        errorState.classList.remove('hidden');
    };

    const showEmptyState = () => {
        jobsGrid.classList.add('hidden');
        paginationNav.classList.add('hidden');
        errorState.classList.add('hidden');
        emptyState.classList.remove('hidden');
    };

    // main render loop
    const renderJobs = () => {
        hideStates();
        
        resultsCount.textContent = `(${filteredJobs.length})`;

        if (filteredJobs.length === 0) {
            showEmptyState();
            return;
        }

        paginationNav.classList.remove('hidden');
        
        const startIndex = (currentPage - 1) * jobsPerPage;
        const endIndex = startIndex + jobsPerPage;
        const jobsToShow = filteredJobs.slice(startIndex, endIndex);
        
        jobsGrid.innerHTML = '';
        
        jobsToShow.forEach(job => {
            const card = document.createElement('article');
            card.className = 'job-card';
            card.innerHTML = `
                <div class="job-card-header">
                    <div>
                        <h3 class="job-title">${job.title}</h3>
                        <p class="company-name">${job.company}</p>
                    </div>
                </div>
                <div class="job-tags">
                    <span class="tag">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                        ${job.location}
                    </span>
                    <span class="tag">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                        ${job.experience}
                    </span>
                    <span class="tag">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                        ${job.type}
                    </span>
                </div>
                <p class="job-desc">${job.description}</p>
                <div class="job-footer">
                    <span class="salary">${job.salary}</span>
                    <button class="btn btn-primary" aria-label="Apply for ${job.title} at ${job.company}">Apply Now</button>
                </div>
            `;
            jobsGrid.appendChild(card);
        });

        renderPagination();
    };

    // handle pages
    const renderPagination = () => {
        const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
        
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;
        
        pageNumbers.innerHTML = '';
        
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 1) {
                const pageBtn = document.createElement('button');
                pageBtn.className = `page-num ${i === currentPage ? 'active' : ''}`;
                pageBtn.textContent = i;
                pageBtn.setAttribute('aria-label', `Page ${i}`);
                pageBtn.addEventListener('click', () => {
                    currentPage = i;
                    window.scrollTo({ top: document.getElementById('jobs').offsetTop - 100, behavior: 'smooth' });
                    renderJobs();
                });
                pageNumbers.appendChild(pageBtn);
            } else if (i === 2 && currentPage > 3) {
                const ellipsis = document.createElement('span');
                ellipsis.textContent = '...';
                ellipsis.style.padding = '0 8px';
                ellipsis.style.color = 'var(--text-muted)';
                pageNumbers.appendChild(ellipsis);
            } else if (i === totalPages - 1 && currentPage < totalPages - 2) {
                const ellipsis = document.createElement('span');
                ellipsis.textContent = '...';
                ellipsis.style.padding = '0 8px';
                ellipsis.style.color = 'var(--text-muted)';
                pageNumbers.appendChild(ellipsis);
            }
        }
    };

    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderJobs();
            window.scrollTo({ top: document.getElementById('jobs').offsetTop - 100, behavior: 'smooth' });
        }
    });

    nextPageBtn.addEventListener('click', () => {
        const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderJobs();
            window.scrollTo({ top: document.getElementById('jobs').offsetTop - 100, behavior: 'smooth' });
        }
    });

    // filters
    const applyFilters = () => {
        const query = searchInput.value.toLowerCase().trim();
        const locFilter = locationFilter.value.toLowerCase();
        const compFilter = companyFilter.value.toLowerCase();

        filteredJobs = allJobs.filter(job => {
            const matchesQuery = job.title.toLowerCase().includes(query) || 
                                 job.company.toLowerCase().includes(query);
            
            let matchesLoc = true;
            if (locFilter) {
                if (locFilter === 'remote') {
                    matchesLoc = job.type.toLowerCase() === 'remote';
                } else {
                    matchesLoc = job.location.toLowerCase().includes(locFilter) || job.title.length > 0;
                }
            }

            let matchesComp = true;
            if (compFilter) {
                matchesComp = job.company.toLowerCase().includes(compFilter);
            }

            return matchesQuery && matchesLoc && matchesComp;
        });

        currentPage = 1;
        renderJobs();
    };

    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        applyFilters();
    });

    searchInput.addEventListener('input', applyFilters);
    locationFilter.addEventListener('change', applyFilters);
    companyFilter.addEventListener('change', applyFilters);
    
    clearFiltersBtn.addEventListener('click', () => {
        searchInput.value = '';
        locationFilter.value = '';
        companyFilter.value = '';
        applyFilters();
    });

    retryBtn.addEventListener('click', fetchJobs);

    // hacking some dummy data to make filters work for the demo
    const setupDemoData = () => {
        const demoLocations = ['Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Mumbai', 'Remote'];
        const demoCompanies = ['Accenture', 'Infosys', 'TCS', 'Wipro', 'Zoho', 'Freshworks', 'Google', 'Microsoft', 'Apple', 'Amazon'];
        
        allJobs.forEach((job, index) => {
            if (index % 2 === 0) {
                job.location = demoLocations[index % demoLocations.length];
            }
            if (index % 3 === 0) {
                job.company = demoCompanies[index % demoCompanies.length];
                job.title = ['Front-End Developer', 'Backend Developer', 'UI/UX Designer', 'Data Analyst', 'Java Developer', 'Full Stack Developer'][index % 6];
            }
        });
    };

    const fetchJobsWithDemoData = async () => {
        await fetchJobs();
        if (allJobs.length > 0) {
            setupDemoData();
            applyFilters();
        }
    };

    fetchJobsWithDemoData();
});
