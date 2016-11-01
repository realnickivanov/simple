define(function(){
	'use strict';

	var _instance = null;

	function Header(courseTitle){
		if (_instance) {
			return _instance;
		}
		this.courseTitle = courseTitle;
		this.isCourseTitleTooLong = this.courseTitle > 100;
	}

	return Header;
});
