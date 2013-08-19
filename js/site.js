//Function waits til page loads to run
$(function() {
    // Create a layers menu from a list of layers, assigns menu items in order with specified data.
    // If geojson layer and a scaled marker: use data: + scale: 
    // If geojson layer and icon: use data: 
    // If MapBox layer: use map: 
    // Use tooltip: to add interactivity, set tooltip below at var = tooltip
    var layers = [

            {
                title: 'Schools',
                map: 'unhcr.infrajordaneduc'
            },
            {
                title: 'Health Centers',
                map: 'unhcr.infra-jordan'
            },
            {
                title: 'Hospitals',
                map: 'unhcr.infrajordanhospital'
            },
            {
                title: 'UNHCR Offices',
                map: 'unhcr.UNHCR-Offices'
            }
        ],
        basemap = {  
            // Sets up the base map toggle       
            satellite: 'unhcr.map-zdgpcmtu', 
            terrain: 'unhcr.map-0wl8cuf8' 
        },
        borders = {         
            //Sets up the borders toggle
            un: 'unhcr.Borders',
            streets: 'unhcr.map-9hudy8xp' 
        },
        markers = mapbox.markers.layer(),
        tileLayers = [], markerLayers = [],
        curLayer,
        tooltipType,
        initLayer,
        index = 2,
        embed = false;
        
    if (window.location.hash.split('?')[1] === 'embed') {
        embed = true;
        $('body').addClass('embed');
    }
    
    $.each(layers, function(i,l) {
        if (l.active) initLayer = i;
        if (l.map) {
            tileLayers.push(l.map);
            layers[i].index = index;
            index++;
            $('#layers').append('<a href="#"' + ((l.active) ? ' class="active"' : '') + ' data-layer="' + i + '">' + l.title + '</a>');
        } else if (l.data) {
            markerLayers.push(l);
            $('#layers').append('<a href="#"' + ((l.active) ? ' class="active"' : '') + ' data-layer="' + i + '">' + l.title + '</a>');
        } else {
            $('#layers').append('<a href="#" data-layer="' + i + '" class="disabled">' + l.title + '</a>');
        }
    });
    
    mapbox.load(tileLayers, function(layer) {
        var m = mapbox.map('map');
        m.addLayer(mapbox.layer().id(basemap.terrain));
        m.addLayer(mapbox.layer().id(borders.un).composite(false));
        (embed) ? m.zoom(5) : m.zoom(5);
        m.center({ lat: 31.59809, lon: 36.36304 }).setZoomRange(7,13); /* Set center and zoom range */
        m.ui.zoomer.add();
        m.ui.attribution.add()
            .content('This map was produced as a reference aid only. The boundaries and names shown and the designations used on this map do not imply official endorsement or acceptance by the United Nations.');
        
        $.each(layer, function(i,l) {
            m.addLayer(l.layer.composite(false));
            m.disableLayerAt(i+2);
        });
        
        m.interaction.auto();
        var interaction = mapbox.markers.interaction(markers);
        m.addLayer(markers);
        
        interaction.formatter(function(feature) {
            return tooltip[tooltipType](feature);
        });
        
        var layerCnt = tileLayers.length + 2;
        
        // Updates basemap on toggle 
        function updateBasemap(type,toggle) {
            if (type === 'basemap') {
                m.getLayerAt(0).id(basemap[toggle]);
            } else {
                m.getLayerAt(1).id(borders[toggle]);
            }
            m.draw();
        }
        
        function updateMap(id) {
            $.each(m.layers, function(i,l) {
                if (i > 1) {
                    m.disableLayerAt(i);
                }
            });
            
            curLayer = layers[id];
            
            if (curLayer.index) {
                m.enableLayerAt(curLayer.index);
                m.interaction.tilejson(m.getLayerAt(curLayer.index).tilejson());
            } else {
                if (curLayer.json) {
                    addMarkers(curLayer.json, curLayer.scale);
                } else {
                    $.getJSON(curLayer.data, function(d) {
                        addMarkers(d, layers[id].scale);
                        layers[id].json = d;
                    });
                }
                tooltipType = layers[id].tooltip;
                m.interaction.tilejson({});
            }
        }
        
        function addMarkers(data, key) {            
            markers.sort(function(a,b){ return b.properties[key] - a.properties[key]; })
                .features(data.features);
            
            // Adding marker scales, totalrepop and num_partners are hardcoded here
            // Uses the cluster.min.js library to draw the markers and scale according to data values 
            if (key) {
                markers.factory(
                    clustr.scale_factory(function(f) {      
                            if (key === 'totalrefpop') {
                                var radius = clustr.area_to_radius(Math.round(f.properties[key]/100));
                                return (radius < 3) ? 5 : radius;
                            } else if (key === 'num_partners') {
                                return clustr.area_to_radius(Math.round(Math.pow(f.properties[key],1.5)*30));
                            }
                        },
                        'rgba(61,150,206,0.6)', /* Color of markers*/
                        '#FFF' /* Outline color of markers*/
                    )
                );
            } else {
                markers.factory(function(f) {
                // Define a new factory function. This takes a GeoJSON object
                // as its input and returns an element - in this case an image -
                // that represents the point.
                    var img = document.createElement('img');
                    img.className = 'marker-image';
                    img.setAttribute('src', f.properties.icon);
                    return img;
                });
            }
            
            m.enableLayerAt(layerCnt);
        }
        
        $('#layers a').click(function(e) {
            e.preventDefault();
            if ($(this).hasClass('disabled') || $(this).hasClass('active')) return;
            
            $('#layers a').removeClass('active');
            $(this).addClass('active');
            
            updateMap($(this).attr('data-layer'));
        });
        
        $('#toggles a').click(function(e) {
            e.preventDefault();
            if ($(this).hasClass('active')) return;
            
            var toggleType = $(this).attr('data-type'),
                toggleLayer = $(this).attr('data-toggle');
            
            $('#toggles a[data-type="' + toggleType + '"]').removeClass('active');
            $(this).addClass('active');
            
            if (toggleLayer === 'satellite') {
                $('body').addClass('satellite');
            }
            if (toggleLayer === 'terrain') {
                $('body').removeClass('satellite');
            }
            
            updateBasemap(toggleType, toggleLayer);
        });
        
        $('#fsbutton').hover(
            function() {
                $('#fslabel').fadeIn();
            },
            function() {
                $('#fslabel').fadeOut();
            }
        );

        updateMap(initLayer);
    });
    
    mapbox.share().map('map').add();
    
    // Set tooltips for each layer 
    var tooltip = {
        // Setting tooltip style for population layer
        population: function(f) {               
            var o = '', p = f.properties;
            
            var total = p.totalrefpop,
                demo_m = [p.DEM_04_M,p.DEM_511_M,p.DEM_1217_M,p.DEM_1859_M,p.DEM_60_M],
                demo_f = [p.DEM_04_F,p.DEM_511_F,p.DEM_1217_F,p.DEM_1859_F,p.DEM_60_F],
                total_m = 0,
                total_f = 0,
                max = 0;
                
            $.each(demo_m, function(i,d) {
                total_m += d;
                total_f += demo_f[i];
                
                if (d > max) max = d;
                if (demo_f[i] > max) max = demo_f[i];
            });
            
            o += '<div class="marker-title">' + ((p.settlementname) ? p.settlementname + ', ' : '') + p.countryname + '</div>';
            
            o += '<div class="marker-stats">'
              +     '<div class="marker-stat-label">Total Registered Population</div>'
              +     '<div class="marker-stat-value">' + formalNumber(total) + ' individuals</div>'
              +  '</div>';
            
            if (max > 0) {
                o += '<div class="marker-pop-chart"><strong>Demography</strong>'
                  +     '<table>'
                  +       '<thead>'
                  +         '<tr>'
                  +           '<th colspan="2"><strong>Male</strong> (' + ((total_m/total)*100).toFixed(1) + '%)</th>'
                  +           '<th class="agerange">Age</th>'
                  +           '<th colspan="2">(' + ((total_f/total)*100).toFixed(1) + '%) <strong>Female</strong></th>'
                  +         '</tr>'
                  +       '</thead>'
                  +       '<tbody>'
                  +         '<tr>'
                  +           '<td>' + ((p.DEM_04_M/total)*100).toFixed(1) + '%</td>'
                  +           '<td class="male bar"><div style="width:' + ((p.DEM_04_M/max)*100) + '%"></div></td>'
                  +           '<td class="agerange">0-4</td>'
                  +           '<td class="female bar"><div style="width:' + ((p.DEM_04_F/max)*100) + '%"></div></td>'
                  +           '<td>' + ((p.DEM_04_F/total)*100).toFixed(1) + '%</td>'
                  +         '</tr>'
                  +         '<tr>'
                  +           '<td>' + ((p.DEM_511_M/total)*100).toFixed(1) + '%</td>'
                  +           '<td class="male bar"><div style="width:' + ((p.DEM_511_M/max)*100) + '%"></div></td>'
                  +           '<td class="agerange">5-11</td>'
                  +           '<td class="female bar"><div style="width:' + ((p.DEM_511_F/max)*100) + '%"></div></td>'
                  +           '<td>' + ((p.DEM_511_F/total)*100).toFixed(1) + '%</td>'
                  +         '</tr>'
                  +         '<tr>'
                  +           '<td>' + ((p.DEM_1217_M/total)*100).toFixed(1) + '%</td>'
                  +           '<td class="male bar"><div style="width:' + ((p.DEM_1217_M/max)*100) + '%"></div></td>'
                  +           '<td class="agerange">12-17</td>'
                  +           '<td class="female bar"><div style="width:' + ((p.DEM_1217_F/max)*100) + '%"></div></td>'
                  +           '<td>' + ((p.DEM_1217_F/total)*100).toFixed(1) + '%</td>'
                  +         '</tr>'
                  +         '<tr>'
                  +           '<td>' + ((p.DEM_1859_M/total)*100).toFixed(1) + '%</td>'
                  +           '<td class="male bar"><div style="width:' + ((p.DEM_1859_M/max)*100) + '%"></div></td>'
                  +           '<td class="agerange">18-59</td>'
                  +           '<td class="female bar"><div style="width:' + ((p.DEM_1859_F/max)*100) + '%"></div></td>'
                  +           '<td>' + ((p.DEM_1859_F/total)*100).toFixed(1) + '%</td>'
                  +         '</tr>'
                  +         '<tr>'
                  +           '<td>' + ((p.DEM_60_M/total)*100).toFixed(1) + '%</td>'
                  +           '<td class="male bar"><div style="width:' + ((p.DEM_60_M/max)*100) + '%"></div></td>'
                  +           '<td class="agerange">60+</td>'
                  +           '<td class="female bar"><div style="width:' + ((p.DEM_60_F/max)*100) + '%"></div></td>'
                  +           '<td>' + ((p.DEM_60_F/total)*100).toFixed(1) + '%</td>'
                  +         '</tr>'
                  +       '</tbody>'
                  +     '</table>'
                  +   '</div>';
            } else {
                o += '<div class="marker-pop-chart"><em>No demographic data</em></div>';
            }
              
            return o;
        },
        relief: function(f) {            
            // Setting the Relief layer tooltip, uses Google Charts API 
            var o = '', p = f.properties;

            var tot = [
                ['Category', 'Parent', 'Number'],
                ['All', null, 0]
            ];
            
            var g = document.getElementById('chart-temp');
            g.setAttribute('id', 'treemap');
            $('#fs').append('<div id="chart-temp" style="width: 300px; height: 125px;"></div>');
            
            $.each(p.sectors, function(k,v) {
                var row = [];
                row.push(k);
                row.push('All');
                row.push(v.partners.length);
                tot.push(row);
            });
            
            drawChart();
            
            function drawChart() {
                var data = google.visualization.arrayToDataTable(tot);
                
                // Create and draw the visualization.
                var tree = new google.visualization.TreeMap(g);
                
                google.visualization.events.addListener(tree, 'onmouseover', function (e) {
                    var sector = data.getValue(e.row, 0);
                    var partners = p.sectors[sector].partners.join(', ');
                    // populate the treemap tooltip with data
                    $('#treetip .treetip-title').html(sector);
                    $('#treetip .treetip-stat').html(p.sectors[sector].partners.length + ' Partners');
                    $('#treetip .treetip-partners').html(partners);
                    // show the treemap tooltip
                    $('#treetip').show();
                    $('#treetip').css({right: 409,top: 10});
                    $('#treetip').addClass("fs-treetip");
                    
                    $('#treemap g:last-child rect').css('stroke-width','0');
                });
                google.visualization.events.addListener(tree, 'onmouseout', function (e) {
                    // hide the treemap tooltip
                    $('#treetip').hide();
                });
                
                tree.draw(data, {
                    minColor: '#eaeaea',
                    midColor: '#8ec2e2', 
                    maxColor: '#2b7bac', 
                    headerHeight: 0,
                    fontColor: '#282828',
                    fontSize: 9,
                    showTooltips: false,
                    maxPostDepth: 0
                });
            }
            
            o += '<div class="marker-title">' + p.name + ', '+ p.country + '</div>';
            o += '<div class="marker-stats">'
              +     '<div class="marker-stat-label">Number of Sectors: ' + p.num_sectors + '</div>'       
              +     '<div class="marker-stat-label">Number of Partners: ' + p.num_partners + '</div>'
              +  '</div>';              
              
            var container = document.createElement('div');
            $(container).append(o).append(g);
  
            return container;
        },
        infrastructure: function(f) { 
            // Setting the infrastructure tooltip style 
            var o = '', p = f.properties;
            o += '<div class="marker-title">' + p.name + '</div>';
            o += '<div class="marker-stats">'
              +     '<div class="marker-stat-label">' + p.type + '</div>'
              +  '</div>';    
  
            return o;
        }
    };
    
    // HTML5 Fullscreen API
    // http://johndyer.name/native-fullscreen-javascript-api-plus-jquery-plugin/
    var fullScreenApi = {
            supportsFullScreen: false,
            isFullScreen: function() { return false; },
            requestFullScreen: function() {},
            cancelFullScreen: function() {},
            fullScreenEventName: '',
            prefix: ''
        },
        browserPrefixes = 'webkit moz o ms khtml'.split(' ');
 
    // check for native support
    if (typeof document.cancelFullScreen != 'undefined') {
        fullScreenApi.supportsFullScreen = true;
    } else {
        // check for fullscreen support by vendor prefix
        for (var i = 0, il = browserPrefixes.length; i < il; i++ ) {
            fullScreenApi.prefix = browserPrefixes[i];
 
            if (typeof document[fullScreenApi.prefix + 'CancelFullScreen' ] != 'undefined' ) {
                fullScreenApi.supportsFullScreen = true;
 
                break;
            }
        }
    }
 
    // update methods to do something useful
    if (fullScreenApi.supportsFullScreen) {
        fullScreenApi.fullScreenEventName = fullScreenApi.prefix + 'fullscreenchange';
 
        fullScreenApi.isFullScreen = function() {
            switch (this.prefix) {
                case '':
                    return document.fullScreen;
                case 'webkit':
                    return document.webkitIsFullScreen;
                default:
                    return document[this.prefix + 'FullScreen'];
            }
        }
        fullScreenApi.requestFullScreen = function(el) {
            return (this.prefix === '') ? el.requestFullScreen() : el[this.prefix + 'RequestFullScreen']();
        }
        fullScreenApi.cancelFullScreen = function(el) {
            return (this.prefix === '') ? document.cancelFullScreen() : document[this.prefix + 'CancelFullScreen']();
        }
    }
 
    // jQuery plugin
    if (typeof jQuery != 'undefined') {
        jQuery.fn.requestFullScreen = function() {
 
            return this.each(function() {
                if (fullScreenApi.supportsFullScreen) {
                    fullScreenApi.requestFullScreen(this);
                }
            });
        };
    }
 
    // export api
    window.fullScreenApi = fullScreenApi;
    
    // do something interesting with fullscreen support
    var fsButton = document.getElementById('fsbutton'),
    	  fsElement = document.getElementById('fs');
    
    if (window.fullScreenApi.supportsFullScreen) {
        // handle button click
    	  fsButton.addEventListener('click', function(e) {
      	    e.preventDefault();
      	    if ($('#fs').hasClass('active')) {
        	      window.fullScreenApi.cancelFullScreen(fsElement);
      	    } else {
      	        window.fullScreenApi.requestFullScreen(fsElement);
      	   }
    	  }, true);
    	  
    	  // detect change in fullscreen
    	  document.addEventListener(fullScreenApi.fullScreenEventName, function () {
            if ($('#fs').hasClass('active')) {
      	        $('#fs').removeClass('active');
      	    } else {
        	      $('#fs').addClass('active');
      	    }
        }, false);
    	
    } else {
    	  $('#fsbutton').css('display','none');
    }
});

// Format a number with commas representing the thousandth place
function formalNumber(n) {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Custom mapbox auto interaction
mapbox.interaction = function() {

    var interaction = wax.mm.interaction(),
        auto = false;

    interaction.refresh = function() {
        var map = interaction.map();
        if (!auto || !map) return interaction;
        for (var i = map.layers.length - 1; i >= 0; i --) {
            if (map.layers[i].enabled) {
                var tj = map.layers[i].tilejson && map.layers[i].tilejson();
                if (tj && tj.template) return interaction.tilejson(tj);
            }
        }
        return interaction.tilejson({});
    };

    interaction.auto = function() {
        auto = true;
        interaction.on(wax.tooltip()
            .parent(interaction.map().parent)
            .events()).on(wax.location().events());
        return interaction.refresh();
    };

    return interaction;
};
