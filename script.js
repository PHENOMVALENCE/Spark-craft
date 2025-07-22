// Modern DOM Elements and State Management
const state = {
  isNavOpen: false,
  scrollPosition: 0,
  animations: new Map(),
  observers: new Map(),
}

// DOM Elements
const hamburger = document.getElementById("hamburger")
const navMenu = document.getElementById("nav-menu")
const navbar = document.getElementById("navbar")
const backToTopBtn = document.getElementById("back-to-top")

// Modern Mobile Navigation with Smooth Animations
function initializeNavigation() {
  hamburger?.addEventListener("click", toggleMobileNav)

  // Close mobile menu when clicking outside
  document.addEventListener("click", (e) => {
    if (state.isNavOpen && !navMenu?.contains(e.target) && !hamburger?.contains(e.target)) {
      closeMobileNav()
    }
  })

  // Enhanced smooth scrolling with easing
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", handleSmoothScroll)
  })

  // Close menu on link clicks
  document.querySelectorAll(".nav-link, .nav-cta").forEach((link) => {
    link.addEventListener("click", closeMobileNav)
  })
}

function toggleMobileNav() {
  state.isNavOpen = !state.isNavOpen
  hamburger?.classList.toggle("active", state.isNavOpen)
  navMenu?.classList.toggle("active", state.isNavOpen)
  document.body.style.overflow = state.isNavOpen ? "hidden" : ""

  // Add smooth animation
  if (state.isNavOpen) {
    navMenu?.style.setProperty("--nav-delay", "0.1s")
  }
}

function closeMobileNav() {
  state.isNavOpen = false
  hamburger?.classList.remove("active")
  navMenu?.classList.remove("active")
  document.body.style.overflow = ""
}

function handleSmoothScroll(e) {
  e.preventDefault()
  const targetId = this.getAttribute("href")
  const target = document.querySelector(targetId)

  if (target) {
    const offsetTop = target.offsetTop - 100

    // Custom smooth scroll with easing
    smoothScrollTo(offsetTop, 1000)

    // Update URL without jumping
    history.pushState(null, null, targetId)
  }
}

function smoothScrollTo(targetPosition, duration) {
  const startPosition = window.pageYOffset
  const distance = targetPosition - startPosition
  const startTime = performance.now()

  function scrollStep(currentTime) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)

    // Easing function (easeInOutCubic)
    const easeProgress = progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2

    window.scrollTo(0, startPosition + distance * easeProgress)

    if (progress < 1) {
      requestAnimationFrame(scrollStep)
    }
  }

  requestAnimationFrame(scrollStep)
}

// Enhanced Scroll Effects with Performance Optimization
function initializeScrollEffects() {
  let ticking = false
  let lastScrollTop = 0

  function updateScrollEffects() {
    const scrollTop = window.pageYOffset
    const scrollDelta = scrollTop - lastScrollTop

    // Navbar effects
    updateNavbar(scrollTop)

    // Back to top button
    updateBackToTop(scrollTop)

    // Parallax effects
    updateParallax(scrollTop)

    // Update floating elements
    updateFloatingElements(scrollTop)

    lastScrollTop = scrollTop
    ticking = false
  }

  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(updateScrollEffects)
      ticking = true
    }
  })
}

function updateNavbar(scrollTop) {
  if (scrollTop > 50) {
    navbar?.classList.add("scrolled")
  } else {
    navbar?.classList.remove("scrolled")
  }
}

function updateBackToTop(scrollTop) {
  if (scrollTop > 400) {
    backToTopBtn?.classList.add("visible")
  } else {
    backToTopBtn?.classList.remove("visible")
  }
}

function updateParallax(scrollTop) {
  const parallaxElements = document.querySelectorAll(".floating-element")

  parallaxElements.forEach((element, index) => {
    const speed = 0.3 + index * 0.1
    const yPos = scrollTop * speed
    element.style.transform = `translateY(${yPos}px) rotate(${Math.sin(scrollTop * 0.001 + index) * 2}deg)`
  })
}

function updateFloatingElements(scrollTop) {
  const elements = document.querySelectorAll(".floating-element")

  elements.forEach((element, index) => {
    const rect = element.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      const progress = (window.innerHeight - rect.top) / window.innerHeight
      const intensity = Math.sin(Date.now() * 0.001 + index) * 10 * progress

      element.style.setProperty("--float-intensity", `${intensity}px`)
    }
  })
}

// Enhanced Intersection Observer with Stagger Animations
function initializeScrollAnimations() {
  const observerOptions = {
    threshold: [0, 0.1, 0.2, 0.3],
    rootMargin: "0px 0px -100px 0px",
  }

  const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Staggered animation delay
        const delay = index * 100

        setTimeout(() => {
          entry.target.classList.add("visible")

          // Add additional effects based on element type
          addElementSpecificEffects(entry.target)
        }, delay)

        animationObserver.unobserve(entry.target)
      }
    })
  }, observerOptions)

  // Observe elements for animation
  const animatedElements = document.querySelectorAll(`
        .problem-card, .benefit-card, .capability-card, 
        .result-stat, .pricing-card, .contact-method,
        .market-stat, .testimonial-card, .smart-feature-card
    `)

  animatedElements.forEach((element, index) => {
    element.classList.add("fade-in")
    element.style.transitionDelay = `${index * 50}ms`
    animationObserver.observe(element)
  })

  state.observers.set("animation", animationObserver)
}

function addElementSpecificEffects(element) {
  // Add hover glow effect for cards
  if (element.classList.contains("problem-card") || element.classList.contains("benefit-card")) {
    element.addEventListener("mouseenter", addGlowEffect)
    element.addEventListener("mouseleave", removeGlowEffect)
  }

  // Add micro-interactions for buttons
  if (element.classList.contains("btn")) {
    addButtonMicroInteractions(element)
  }
}

function addGlowEffect(e) {
  e.target.style.filter = "drop-shadow(0 20px 40px rgba(99, 102, 241, 0.2))"
}

function removeGlowEffect(e) {
  e.target.style.filter = ""
}

function addButtonMicroInteractions(button) {
  button.addEventListener("mouseenter", () => {
    button.style.transform = "translateY(-2px) scale(1.02)"
  })

  button.addEventListener("mouseleave", () => {
    button.style.transform = ""
  })

  button.addEventListener("mousedown", () => {
    button.style.transform = "translateY(0) scale(0.98)"
  })

  button.addEventListener("mouseup", () => {
    button.style.transform = "translateY(-2px) scale(1.02)"
  })
}

// Enhanced Counter Animations with Better Performance
function initializeCounterAnimations() {
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !entry.target.hasAttribute("data-animated")) {
          entry.target.setAttribute("data-animated", "true")
          animateCounterWithEasing(entry.target)
        }
      })
    },
    { threshold: 0.7 },
  )

  document.querySelectorAll("[data-target]").forEach((counter) => {
    counterObserver.observe(counter)
  })

  state.observers.set("counter", counterObserver)
}

function animateCounterWithEasing(element) {
  const target = Number.parseFloat(element.dataset.target) || 0
  const duration = 2000
  const startTime = performance.now()

  function updateCounter(currentTime) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)

    // Easing function for smooth counter animation
    const easedProgress = 1 - Math.pow(1 - progress, 3)
    const currentValue = target * easedProgress

    element.textContent = formatCounterNumber(currentValue)

    if (progress < 1) {
      requestAnimationFrame(updateCounter)
    } else {
      element.textContent = formatCounterNumber(target)
    }
  }

  requestAnimationFrame(updateCounter)
}

function formatCounterNumber(num) {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + "B"
  } else if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M"
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K"
  } else {
    return Math.floor(num).toString()
  }
}

// Enhanced Form Handling with Better UX
function initializeFormHandling() {
  const demoForm = document.getElementById("demo-form")

  if (demoForm) {
    demoForm.addEventListener("submit", handleFormSubmission)

    // Add real-time validation
    const inputs = demoForm.querySelectorAll("input, select, textarea")
    inputs.forEach((input) => {
      input.addEventListener("blur", validateField)
      input.addEventListener("input", clearFieldError)
    })
  }
}

async function handleFormSubmission(e) {
  e.preventDefault()

  const submitBtn = this.querySelector(".form-submit") || this.querySelector('[type="submit"]')
  const originalText = submitBtn?.innerHTML

  if (!validateForm(this)) {
    showNotification("Please fix the errors and try again.", "error")
    return
  }

  // Enhanced loading state
  if (submitBtn) {
    submitBtn.innerHTML = `
            <span>Processing...</span>
            <div class="loading-spinner"></div>
        `
    submitBtn.disabled = true
    submitBtn.style.background = "#9ca3af"
  }

  try {
    const formData = new FormData(this)
    const response = await fetch("contact.php", {
      method: "POST",
      body: formData,
    })

    const result = await response.json()

    if (result.success) {
      showNotification("Thank you! We'll contact you within 24 hours to schedule your demo.", "success")
      this.reset()

      // Add success animation
      this.style.transform = "scale(0.98)"
      setTimeout(() => {
        this.style.transform = ""
      }, 200)
    } else {
      throw new Error(result.error || "Something went wrong")
    }
  } catch (error) {
    showNotification(error.message || "Sorry, there was an error. Please try again.", "error")
  } finally {
    if (submitBtn) {
      submitBtn.innerHTML = originalText
      submitBtn.disabled = false
      submitBtn.style.background = ""
    }
  }
}

function validateForm(form) {
  let isValid = true
  const inputs = form.querySelectorAll("input[required], select[required], textarea[required]")

  inputs.forEach((input) => {
    if (!validateField({ target: input })) {
      isValid = false
    }
  })

  return isValid
}

function validateField(e) {
  const field = e.target
  const value = field.value.trim()
  let isValid = true
  let message = ""

  // Remove existing error states
  clearFieldError(e)

  // Required field validation
  if (field.hasAttribute("required") && !value) {
    message = "This field is required"
    isValid = false
  }

  // Email validation
  if (field.type === "email" && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) {
      message = "Please enter a valid email address"
      isValid = false
    }
  }

  // Phone validation
  if (field.type === "tel" && value) {
    const phoneRegex = /^[+]?[1-9][\d]{0,15}$/
    if (!phoneRegex.test(value.replace(/[\s\-()]/g, ""))) {
      message = "Please enter a valid phone number"
      isValid = false
    }
  }

  if (!isValid) {
    addFieldError(field, message)
  }

  return isValid
}

function addFieldError(field, message) {
  field.classList.add("error")
  field.style.borderColor = "#ef4444"
  field.style.boxShadow = "0 0 0 3px rgba(239, 68, 68, 0.1)"

  // Add error message
  let errorElement = field.parentNode.querySelector(".error-message")
  if (!errorElement) {
    errorElement = document.createElement("div")
    errorElement.className = "error-message"
    errorElement.style.cssText = `
            color: #ef4444;
            font-size: 0.875rem;
            margin-top: 0.25rem;
            animation: slideDown 0.3s ease;
        `
    field.parentNode.appendChild(errorElement)
  }
  errorElement.textContent = message
}

function clearFieldError(e) {
  const field = e.target
  field.classList.remove("error")
  field.style.borderColor = ""
  field.style.boxShadow = ""

  const errorElement = field.parentNode.querySelector(".error-message")
  if (errorElement) {
    errorElement.remove()
  }
}

// Enhanced Notification System
function showNotification(message, type = "info", duration = 5000) {
  // Remove existing notifications
  document.querySelectorAll(".notification").forEach((n) => n.remove())

  const notification = document.createElement("div")
  notification.className = `notification notification-${type}`

  const colors = {
    success: { bg: "#10b981", text: "white" },
    error: { bg: "#ef4444", text: "white" },
    info: { bg: "#3b82f6", text: "white" },
    warning: { bg
