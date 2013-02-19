## UNHCR Situation Map Template

The UNHCR Situation Map is a template microsite designed by [Development Seed](http://developmentseed.org). This site is available at <http://unhcr.github.com/situation-map>.

See `data/README.md` and `working-folder/README.md` for further information about the data powering the site. 

## System requirements

*For running the site locally and updating data.*

Use [Ruby Gem](http://rubygems.org/) to install:

- [Jekyll](http://jekyllrb.com/)
- [liquid](http://liquidmarkup.org/)
- [rdiscount](https://github.com/rtomayko/rdiscount/)

*For processing data and maps*

- [TileMill](http://mapbox.com/tilemill/)
- [Python 2.7+](http://www.python.org/download/)
- [git](http://git-scm.com/)

## Check out site from repository

    # This will check out the site from the remote repository on
    # GitHub and place it in a local directory named situation-map/
    git clone https://github.com/unhcr/situation-map.git
    # Your site should now be here:
    ls situation-map/

## Run site

    cd situation-map/
    jekyll

Point browser to `http://0.0.0.0:4000/situation-map`