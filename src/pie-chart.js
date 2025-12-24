/**
 * PieChart class for DataViz Toolkit
 * Extends the base Chart class to provide pie chart functionality
 */

import Chart from './chart.js';

class PieChart extends Chart {
  constructor(container, options = {}) {
    super(container, { ...options, type: 'pie' });
    
    this.segments = new Map();
    this.colorPalette = options.colorPalette || [
      '#3498db', '#2ecc71', '#e74c3c', '#f39c12', 
      '#9b59b6', '#1abc9c', '#d35400', '#34495e'
    ];
    this.legend = options.legend !== false;
  }
  
  /**
   * Render pie chart
   */
  render() {
    this.cleanupSVGElements();
    
    if (!this.options.data || !this.options.data.labels || !this.options.data.datasets) {
      console.error('Pie chart requires data with labels and datasets');
      return;
    }
    
    const data = this.options.data.datasets[0].data;
    const labels = this.options.data.labels;
    const total = data.reduce((sum, value) => sum + value, 0);
    
    // Create pie segments
    let startAngle = 0;
    data.forEach((value, index) => {
      const percentage = value / total;
      const angle = percentage * 2 * Math.PI;
      
      this.createSegment(startAngle, startAngle + angle, index, labels[index], value, percentage);
      startAngle += angle;
    });
    
    // Create legend if enabled
    if (this.legend) {
      this.createLegend(labels);
    }
    
    // Attach events
    this.attachEvents();
  }
  
  /**
   * Create a pie segment
   */
  createSegment(startAngle, endAngle, index, label, value, percentage) {
    const centerX = 150;
    const centerY = 150;
    const radius = 100;
    
    // Calculate arc points
    const startX = centerX + radius * Math.cos(startAngle);
    const startY = centerY + radius * Math.sin(startAngle);
    const endX = centerX + radius * Math.cos(endAngle);
    const endY = centerY + radius * Math.sin(endAngle);
    
    // Large arc flag (1 if angle > 180 degrees)
    const largeArcFlag = (endAngle - startAngle) > Math.PI ? 1 : 0;
    
    // Create path for the segment
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const pathData = [
      `M ${centerX},${centerY}`,
      `L ${startX},${startY}`,
      `A ${radius},${radius} 0 ${largeArcFlag} 1 ${endX},${endY}`,
      'Z'
    ].join(' ');
    
    path.setAttribute('d', pathData);
    path.setAttribute('fill', this.colorPalette[index % this.colorPalette.length]);
    path.setAttribute('stroke', '#fff');
    path.setAttribute('stroke-width', '2');
    path.setAttribute('data-segment-index', index);
    path.setAttribute('data-interactive', 'true');
    path.setAttribute('class', 'pie-segment');
    
    // Store segment info
    this.segments.set(index, {
      element: path,
      label,
      value,
      percentage,
      color: this.colorPalette[index % this.colorPalette.length]
    });
    
    this.svg.appendChild(path);
    this.svgElements.add(path);
    
    // Add percentage label in the middle of the segment
    if (percentage > 0.1) { // Only show label for segments > 10%
      const midAngle = startAngle + (endAngle - startAngle) / 2;
      const labelRadius = radius * 0.6;
      const labelX = centerX + labelRadius * Math.cos(midAngle);
      const labelY = centerY + labelRadius * Math.sin(midAngle);
      
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', labelX);
      text.setAttribute('y', labelY);
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('alignment-baseline', 'middle');
      text.setAttribute('fill', '#fff');
      text.setAttribute('font-size', '12');
      text.setAttribute('font-weight', 'bold');
      text.textContent = `${(percentage * 100).toFixed(1)}%`;
      
      this.svg.appendChild(text);
      this.svgElements.add(text);
    }
  }
  
  /**
   * Create legend
   */
  createLegend(labels) {
    const legendGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    legendGroup.setAttribute('transform', 'translate(300, 20)');
    
    labels.forEach((label, index) => {
      const legendItem = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      legendItem.setAttribute('transform', `translate(0, ${index * 25})`);
      
      // Color box
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', '0');
      rect.setAttribute('y', '0');
      rect.setAttribute('width', '20');
      rect.setAttribute('height', '20');
      rect.setAttribute('fill', this.colorPalette[index % this.colorPalette.length]);
      rect.setAttribute('stroke', '#333');
      rect.setAttribute('stroke-width', '1');
      
      // Label text
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', '30');
      text.setAttribute('y', '15');
      text.setAttribute('fill', '#333');
      text.setAttribute('font-size', '14');
      text.textContent = label;
      
      legendItem.appendChild(rect);
      legendItem.appendChild(text);
      legendGroup.appendChild(legendItem);
    });
    
    this.svg.appendChild(legendGroup);
    this.svgElements.add(legendGroup);
  }
  
  /**
   * Handle mouse over event for segments
   */
  handleMouseOver(event) {
    const segmentIndex = parseInt(event.target.getAttribute('data-segment-index'));
    const segment = this.segments.get(segmentIndex);
    
    if (segment) {
      // Highlight segment
      event.target.style.opacity = '0.9';
      event.target.style.transform = 'scale(1.05)';
      event.target.style.transformOrigin = 'center';
      
      // Show tooltip
      this.showTooltip(event, segment);
    }
  }
  
  /**
   * Handle mouse out event for segments
   */
  handleMouseOut(event) {
    const segmentIndex = parseInt(event.target.getAttribute('data-segment-index'));
    const segment = this.segments.get(segmentIndex);
    
    if (segment) {
      // Restore segment
      event.target.style.opacity = '1';
      event.target.style.transform = 'scale(1)';
      
      // Hide tooltip
      this.hideTooltip();
    }
  }
  
  /**
   * Show tooltip for segment
   */
  showTooltip(event, segment) {
    // Remove existing tooltip
    this.hideTooltip();
    
    // Create tooltip
    this.tooltip = document.createElement('div');
    this.tooltip.className = 'dataviz-tooltip';
    this.tooltip.style.position = 'absolute';
    this.tooltip.style.background = 'rgba(0, 0, 0, 0.8)';
    this.tooltip.style.color = 'white';
    this.tooltip.style.padding = '8px 12px';
    this.tooltip.style.borderRadius = '4px';
    this.tooltip.style.fontSize = '14px';
    this.tooltip.style.pointerEvents = 'none';
    this.tooltip.style.zIndex = '1000';
    
    this.tooltip.innerHTML = `
      <strong>${segment.label}</strong><br>
      Value: ${segment.value}<br>
      Percentage: ${(segment.percentage * 100).toFixed(1)}%
    `;
    
    // Position tooltip
    const rect = this.container.getBoundingClientRect();
    this.tooltip.style.left = `${event.clientX - rect.left + 10}px`;
    this.tooltip.style.top = `${event.clientY - rect.top - 40}px`;
    
    this.container.appendChild(this.tooltip);
  }
  
  /**
   * Hide tooltip
   */
  hideTooltip() {
    if (this.tooltip && this.tooltip.parentNode) {
      this.tooltip.parentNode.removeChild(this.tooltip);
      this.tooltip = null;
    }
  }
  
  /**
   * Clean up pie chart specific resources
   */
  destroy() {
    this.hideTooltip();
    this.segments.clear();
    super.destroy();
  }
}

export default PieChart;