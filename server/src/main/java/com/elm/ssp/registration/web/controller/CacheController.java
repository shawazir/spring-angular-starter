package com.elm.ssp.registration.web.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * @author Abdullah Bawazir
 * 
 */
@Controller
public class CacheController {

	@RequestMapping(value = "/cache/faqs", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<String> getFaqs() {
		return new ResponseEntity<String>("Spring works :)", HttpStatus.OK);
	}
}
