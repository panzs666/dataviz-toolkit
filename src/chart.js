/**
 * Base Chart class for DataViz Toolkit
 */

class Chart {
  constructor(container, options = {}) {
    this.container = typeof container === 'string' 
      ? document.querySelector(container) 
      : container;
    
    this.options = {
      type: 'line',
      data: {},
      ...options
    };
    
    this.eventListeners = new Map();
    this.svgElements = new Set();
    this.initialized = false;
  }
  
  /**
   * Initialize the chart
   */
  init() {
    if (this.initialized) {
      console.warn('Chart already initialized');
      return;
    }
    
    this.createSVG();
    this.render();
    this.attachEvents();
    this.initialized = true;
  }
  
  /**
   * Create SVG container
   */
  createSVG() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('class', 'dataviz-chart');
    
    this.container.appendChild(svg);
    this.svg = svg;
  }
  
  /**
   * Render chart based on type
   */
  render() {
    switch (this.options.type) {
      case 'line':
        this.renderLineChart();
        break;
      case 'bar':
        this.renderBarChart();
        break;
      case 'scatter':
        this.renderScatterPlot();
        break;
      default:
        console.error(`Unsupported chart type: ${this.options.type}`);
    }
  }
  
  /**
   * Update chart data
   * @param {Object} newData - New data to display
   */
  updateData(newData) {
    // Clean up old event listeners before updating
    this.cleanupEventListeners();
    
    // Remove old SVG elements
    this.cleanupSVGElements();
    
    // Update data
    this.options.data = { ...this.options.data, ...newData };
    
    // Re-render
    this.render();
    
    // Re-attach events
    this.attachEvents();
  }
  
  /**
   * Clean up event listeners to prevent memory leaks
   */
  cleanupEventListeners() {
    for (const [element, listeners] of this.eventListeners) {
      for (const [event, handler] of listeners) {
        element.removeEventListener(event, handler);
      }
    }
    this.eventListeners.clear();
  }
  
  /**
   * Clean up SVG elements
   */
  cleanupSVGElements() {
    // Remove all child elements except the main SVG
    while (this.svg.firstChild) {
      this.svg.removeChild(this.svg.firstChild);
    }
    this.svgElements.clear();
  }
  
  /**
   * Attach event listeners
   */
  attachEvents() {
    // Implementation depends on chart type
    // This is a simplified version
    if (this.options.interactive) {
      const elements = this.svg.querySelectorAll('[data-interactive]');
      elements.forEach(element => {
        const mouseoverHandler = (e) => this.handleMouseOver(e);
        const mouseoutHandler = (e) => this.handleMouseOut(e);
        
        element.addEventListener('mouseover', mouseoverHandler);
        element.addEventListener('mouseout', mouseoutHandler);
        
        // Store for cleanup
        if (!this.eventListeners.has(element)) {
          this.eventListeners.set(element, new Map());
        }
        this.eventListeners.get(element).set('mouseover', mouseoverHandler);
        this.eventListeners.get(element).set('mouseout', mouseoutHandler);
      });
    }
  }
  
  /**
   * Handle mouse over event
   */
  handleMouseOver(event) {
    // Highlight element
    event.target.style.opacity = '0.8';
  }
  
  /**
   * Handle mouse out event
   */
  handleMouseOut(event) {
    // Restore element
    event.target.style.opacity = '1';
  }
  
  /**
   * Destroy chart and clean up resources
   */
  destroy() {
    this.cleanupEventListeners();
    this.cleanupSVGElements();
    
    if (this.svg && this.svg.parentNode) {
      this.svg.parentNode.removeChild(this.svg);
    }
    
    this.initialized = false;
  }
  
  // Chart type specific render methods
  renderLineChart() {
    // Simplified line chart rendering
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    line.setAttribute('d', 'M0,100 L100,50 L200,150 L300,75');
    line.setAttribute('stroke', '#3498db');
    line.setAttribute('stroke-width', '2');
    line.setAttribute('fill', 'none');
    
    this.svg.appendChild(line);
    this.svgElements.add(line);
  }
  
  renderBarChart() {
    // Simplified bar chart rendering
    const bars = [
      { x: 50, y: 100, width: 40, height: 80 },
      { x: 100, y: 60, width: 40, height: 120 },
      { x: 150, y: 80, width: 40, height: 100 }
    ];
    
    bars.forEach(bar => {
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', bar.x);
      rect.setAttribute('y', bar.y);
      rect.setAttribute('width', bar.width);
      rect.setAttribute('height', bar.height);
      rect.setAttribute('fill', '#2ecc71');
      rect.setAttribute('data-interactive', 'true');
      
      this.svg.appendChild(rect);
      this.svgElements.add(rect);
    });
  }
  
  renderScatterPlot() {
    // Simplified scatter plot rendering
    const points = [
      { cx: 50, cy: 50 },
      { cx: 100, cy: 150 },
      { cx: 150, cy: 100 },
      { cx: 200, cy: 200 }
    ];
    
    points.forEach(point => {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', point.cx);
      circle.setAttribute('cy', point.cy);
      circle.setAttribute('r', '5');
      circle.setAttribute('fill', '#e74c3c');
      circle.setAttribute('data-interactive', 'true');
      
      this.svg.appendChild(circle);
      this.svgElements.add(circle);
    });
  }
}

export default Chart;