#!/bin/bash
# Get the coordinates of the active window's
#    top-left corner, and the window's size.
#    This excludes the window decoration.

 dimensions=$(xdpyinfo | awk '$1=="dimensions:"{print $2}')
 screen_width=${dimensions%x*}
 info=( $(wmctrl -d | awk '{print $4, $6}') )
 desktop_width=${info[0]%x*}
gnome_flag="0";
 if [ "$desktop_width" = "screen_width" ]; then
	gnome_flag= $(wmctrl -d|wc -l);
	current_vp= $(wmctrl -d|grep '*'|cut -c 1);
else
 viewports=$(( desktop_width / screen_width ))
 current_vp=$(( ${info[1]%,*} / screen_width ))



  unset x y w h 
  eval $(xwininfo -id $(xdotool getactivewindow) |
    sed -n -e "s/^ \+Absolute upper-left X: \+\([0-9]\+\).*/x=\1/p" \
           -e "s/^ \+Absolute upper-left Y: \+\([0-9]\+\).*/y=\1/p" \
           -e "s/^ \+Width: \+\([0-9]\+\).*/w=\1/p" \
           -e "s/^ \+Height: \+\([0-9]\+\).*/h=\1/p" )
  #echo -n "$x $y $w $h"
fi

if [ "$gnome_flag" == "0" ]; then
	if [ "$1" = "r" ] && [ "$current_vp" -lt "$(($viewports-1))" ]; then
		#echo 'hoho';
		
		if [ "$2" = "5" ]; then
			
			wmctrl -o $((($current_vp+1)*$screen_width)),0;
		else
			
			wmctrl -r :ACTIVE: -e 0,$((screen_width+x)),-1,-1,-1;
		fi
	fi
	if [ "$1" = "l" ] && [ "$current_vp" -gt "0" ]; then
		#echo 'yoyo';
		if [ "$2" = "5" ]; then
			wmctrl -o $((($current_vp-1)*$screen_width)),0;
		else
			wmctrl -r :ACTIVE: -e 0,$((x-screen_width)),-1,-1,-1;
		fi
	fi
else
	#for gnome desktops
	if [ "$1" = "r" ] && [ "$current_vp" -lt "$(($gnome_flag-1))" ]; then
		if [ "$2" = "5" ]; then
			wmctrl -s $(($current_vp+1));
		else
			wmctrl -r :ACTIVE: -t $(($current_vp+1));
		fi
	fi
	if [ "$1" = "l" ] && [ "$current_vp" -gt "0" ]; then
		if [ "$2" = "5" ]; then
			wmctrl -s $(($current_vp-1));
		else
			wmctrl -r :ACTIVE: -t $(($current_vp-1));
		fi
	fi
fi

